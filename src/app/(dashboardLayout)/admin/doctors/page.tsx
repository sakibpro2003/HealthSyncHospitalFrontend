"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Pencil,
  RefreshCcw,
  Search,
  Stethoscope,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  extractDoctorMeta,
  normaliseDoctorResult,
  useGetAllDoctorQuery,
  useUpdateDoctorMutation,
  type IDoctor,
} from "@/redux/features/doctor/doctorApi";

const ALL_DEPARTMENTS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General",
  "Radiology",
  "Psychiatry",
  "Emergency",
  "Dental",
  "Oncology",
  "Urology",
];

const PAGE_SIZE = 9;

type DoctorFormState = {
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  image: string;
  consultationFee: string;
  availabilityDays: string;
  availabilityFrom: string;
  availabilityTo: string;
  availabilityLocation: string;
  education: string;
  experience: string;
  bio: string;
};

const buildFormState = (doctor: IDoctor): DoctorFormState => ({
  name: doctor.name ?? "",
  email: doctor.email ?? "",
  phone: doctor.phone ?? "",
  department: doctor.department ?? "",
  specialization: doctor.specialization ?? "",
  image: doctor.image ?? "",
  consultationFee:
    doctor.consultationFee !== undefined && doctor.consultationFee !== null
      ? String(doctor.consultationFee)
      : "",
  availabilityDays: doctor.availability?.days?.join(", ") ?? "",
  availabilityFrom: doctor.availability?.from ?? "",
  availabilityTo: doctor.availability?.to ?? "",
  availabilityLocation: doctor.availability?.location ?? "",
  education: Array.isArray(doctor.education)
    ? doctor.education.join("\n")
    : typeof doctor.education === "string"
    ? doctor.education
    : "",
  experience: doctor.experience ?? "",
  bio: doctor.bio ?? "",
});

const AdminDoctorsPage = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [formState, setFormState] = useState<DoctorFormState | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const normalizedSearch = useMemo(() => search.trim(), [search]);

  const selectedDepartment =
    departmentFilter === "all" ? undefined : departmentFilter;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllDoctorQuery({
    department: selectedDepartment,
    page,
    limit: PAGE_SIZE,
    searchTerm: normalizedSearch || undefined,
  });
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

  const doctors = useMemo(
    () => normaliseDoctorResult(data?.data?.result),
    [data],
  );

  const departments = useMemo(() => {
    const combined = new Set<string>(ALL_DEPARTMENTS);
    doctors.forEach((doctor) => {
      if (doctor.department) {
        combined.add(doctor.department);
      }
    });
    return Array.from(combined).sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  const meta = extractDoctorMeta(data?.data?.result, data?.data?.meta);
  const totalDoctors = meta?.total ?? doctors.length;
  const totalPages = meta?.totalPage ?? 1;

  useEffect(() => {
    setPage(1);
  }, [departmentFilter, normalizedSearch]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleOpenEdit = (doctor: IDoctor) => {
    setSelectedDoctor(doctor);
    setFormState(buildFormState(doctor));
    setSheetOpen(true);
  };

  const handleSheetChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedDoctor(null);
      setFormState(null);
    }
  };

  const handleFieldChange = (
    field: keyof DoctorFormState,
    value: string,
  ) => {
    setFormState((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : prev,
    );
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !formState) {
      return;
    }

    if (!formState.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!formState.email.trim()) {
      toast.error("Email is required.");
      return;
    }
    if (!formState.department.trim()) {
      toast.error("Department is required.");
      return;
    }
    if (!formState.specialization.trim()) {
      toast.error("Specialisation is required.");
      return;
    }

    const {
      availabilityDays,
      availabilityFrom,
      availabilityTo,
      availabilityLocation,
      education,
      consultationFee,
      ...rest
    } = formState;

    const days = availabilityDays
      .split(/,|\n/)
      .map((entry) => entry.trim())
      .filter(Boolean);

    const educationList = education
      .split("\n")
      .map((entry) => entry.trim())
      .filter(Boolean);

    const feeValue = consultationFee.trim();
    let parsedFee: number | undefined;
    if (feeValue.length > 0) {
      const numeric = Number(feeValue);
      if (Number.isNaN(numeric)) {
        toast.error("Consultation fee must be a valid number.");
        return;
      }
      parsedFee = numeric;
    }

    const payload: Partial<IDoctor> = {
      name: rest.name.trim(),
      email: rest.email.trim(),
      phone: rest.phone.trim(),
      department: rest.department.trim(),
      specialization: rest.specialization.trim(),
      image: rest.image.trim(),
      experience: rest.experience.trim() || undefined,
      bio: rest.bio.trim() || undefined,
      consultationFee: parsedFee,
      availability: {
        days,
        from: availabilityFrom.trim(),
        to: availabilityTo.trim(),
        ...(availabilityLocation.trim().length > 0 && {
          location: availabilityLocation.trim(),
        }),
      },
      education: educationList,
    };

    if (!payload.availability?.from || !payload.availability?.to) {
      toast.error("Availability window requires both start and end times.");
      return;
    }

    try {
      await updateDoctor({ id: selectedDoctor._id, payload }).unwrap();
      toast.success("Doctor profile updated.");
      handleSheetChange(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update doctor profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading doctors...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-semibold text-red-500">
          Failed to load doctors.
        </p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <section className="space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Stethoscope className="h-6 w-6 text-sky-600" />
            Doctors
          </h1>
          <p className="text-sm text-slate-500">
            Update doctor availability and profile details shown to patients.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </header>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, specialization, or email"
            className="pl-9"
          />
        </div>
        <Select
          value={departmentFilter}
          onValueChange={(value) => {
            setDepartmentFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-500">
              <Users className="h-4 w-4" />
              Total doctors
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xl font-semibold text-slate-900">
              {totalDoctors}
            </p>
          </CardContent>
        </Card>
      </div>

      {doctors.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-10 text-center">
          <p className="text-lg font-semibold text-slate-800">
            No doctors match the current filters.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Try clearing the search or selecting another department.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => {
            const educationEntries = Array.isArray(doctor.education)
              ? doctor.education
              : doctor.education
              ? [doctor.education]
              : [];
            return (
              <Card
                key={doctor._id}
                className="flex h-full flex-col justify-between border border-slate-200/80 bg-white/90 shadow-sm"
              >
                <CardHeader className="gap-2 pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg text-slate-900">
                        {doctor.name}
                      </CardTitle>
                      <p className="text-xs text-slate-500">{doctor.email}</p>
                    </div>
                    <Badge className="bg-sky-100 text-sky-700">
                      {doctor.department}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {doctor.specialization}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div>
                    <p>
                      <span className="font-medium text-slate-500">Phone:</span>{" "}
                      {doctor.phone || "—"}
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">Fee:</span>{" "}
                      {doctor.consultationFee
                        ? `৳${doctor.consultationFee}`
                        : "Not set"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Availability
                    </p>
                    <p className="mt-1">
                      {doctor.availability?.days?.join(", ") || "Schedule TBD"}
                    </p>
                    <p className="text-sm">
                      {doctor.availability?.from && doctor.availability?.to
                        ? `${doctor.availability.from} – ${doctor.availability.to}`
                        : "Time not set"}
                    </p>
                  </div>
                  {educationEntries.length ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Education
                      </p>
                      <ul className="mt-1 space-y-1 text-xs">
                        {educationEntries.map((item, index) => (
                          <li key={`${doctor._id}-edu-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(doctor)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex flex-col items-center gap-2 pt-2">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (page === 1) return;
                    setPage((prev) => prev - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <PaginationItem key={`doctor-page-${pageNumber}`}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === page}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (page === totalPages) return;
                    setPage((prev) => prev + 1);
                  }}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}

      <Sheet open={sheetOpen} onOpenChange={handleSheetChange}>
        <SheetContent side="right" className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Edit doctor</SheetTitle>
            <SheetDescription>
              Update the profile to keep departmental listings accurate.
            </SheetDescription>
          </SheetHeader>

          {formState ? (
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="doctor-name">Name</Label>
                  <Input
                    id="doctor-name"
                    value={formState.name}
                    onChange={(event) =>
                      handleFieldChange("name", event.target.value)
                    }
                    placeholder="Dr. Jane Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor-email">Email</Label>
                  <Input
                    id="doctor-email"
                    type="email"
                    value={formState.email}
                    onChange={(event) =>
                      handleFieldChange("email", event.target.value)
                    }
                    placeholder="doctor@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor-phone">Phone</Label>
                  <Input
                    id="doctor-phone"
                    value={formState.phone}
                    onChange={(event) =>
                      handleFieldChange("phone", event.target.value)
                    }
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor-department">Department</Label>
                  <Input
                    id="doctor-department"
                    value={formState.department}
                    onChange={(event) =>
                      handleFieldChange("department", event.target.value)
                    }
                    placeholder="Cardiology"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor-specialisation">Specialisation</Label>
                  <Input
                    id="doctor-specialisation"
                    value={formState.specialization}
                    onChange={(event) =>
                      handleFieldChange("specialization", event.target.value)
                    }
                    placeholder="Interventional Cardiologist"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor-image">Profile image URL</Label>
                  <Input
                    id="doctor-image"
                    value={formState.image}
                    onChange={(event) =>
                      handleFieldChange("image", event.target.value)
                    }
                    placeholder="https://…"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor-fee">Consultation fee (৳)</Label>
                  <Input
                    id="doctor-fee"
                    type="number"
                    inputMode="numeric"
                    value={formState.consultationFee}
                    onChange={(event) =>
                      handleFieldChange("consultationFee", event.target.value)
                    }
                    placeholder="1500"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Availability
                </p>
                <div className="mt-3 grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="doctor-availability-days">Days</Label>
                    <Input
                      id="doctor-availability-days"
                      value={formState.availabilityDays}
                      onChange={(event) =>
                        handleFieldChange(
                          "availabilityDays",
                          event.target.value,
                        )
                      }
                      placeholder="Sunday, Tuesday, Thursday"
                    />
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="doctor-availability-from">From</Label>
                      <Input
                        id="doctor-availability-from"
                        value={formState.availabilityFrom}
                        onChange={(event) =>
                          handleFieldChange(
                            "availabilityFrom",
                            event.target.value,
                          )
                        }
                        placeholder="09:00 AM"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="doctor-availability-to">To</Label>
                      <Input
                        id="doctor-availability-to"
                        value={formState.availabilityTo}
                        onChange={(event) =>
                          handleFieldChange(
                            "availabilityTo",
                            event.target.value,
                          )
                        }
                        placeholder="05:00 PM"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="doctor-availability-location">
                      Location (optional)
                    </Label>
                    <Input
                      id="doctor-availability-location"
                      value={formState.availabilityLocation}
                      onChange={(event) =>
                        handleFieldChange(
                          "availabilityLocation",
                          event.target.value,
                        )
                      }
                      placeholder="Outpatient Clinic, Level 4"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="doctor-education">Education</Label>
                  <Textarea
                    id="doctor-education"
                    value={formState.education}
                    onChange={(event) =>
                      handleFieldChange("education", event.target.value)
                    }
                    placeholder={"MBBS - Dhaka Medical College\nFCPS - BIRDEM"}
                    rows={3}
                  />
                  <p className="text-xs text-slate-500">
                    Each qualification on a separate line.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor-experience">Experience</Label>
                  <Textarea
                    id="doctor-experience"
                    value={formState.experience}
                    onChange={(event) =>
                      handleFieldChange("experience", event.target.value)
                    }
                    placeholder="12 years leading minimally invasive cardiac surgery programs."
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor-bio">Bio</Label>
                  <Textarea
                    id="doctor-bio"
                    value={formState.bio}
                    onChange={(event) =>
                      handleFieldChange("bio", event.target.value)
                    }
                    placeholder="Short professional summary visible to patients."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-slate-500">
              No doctor selected.
            </div>
          )}

          <SheetFooter>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => handleSheetChange(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleSubmit}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </span>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default AdminDoctorsPage;
