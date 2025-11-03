"use client";

import { useMemo, useState } from "react";
import {
  useAdjustBloodInventoryMutation,
  useCreateBloodInventoryMutation,
  useDeleteBloodInventoryMutation,
  useGetBloodInventoriesQuery,
  useGetInventorySummaryQuery,
  useUpdateBloodInventoryMutation,
} from "@/redux/features/bloodBank/bloodBankApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

type InventoryFormState = {
  bloodGroup: string;
  units: string;
  minimumThreshold: string;
  notes: string;
};

type AdjustFormState = {
  inventoryId?: string;
  bloodGroup?: string;
  adjustBy: string;
  note: string;
};

const initialInventoryForm: InventoryFormState = {
  bloodGroup: "",
  units: "",
  minimumThreshold: "",
  notes: "",
};

const initialAdjustForm: AdjustFormState = {
  inventoryId: undefined,
  bloodGroup: "",
  adjustBy: "",
  note: "",
};

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: { message?: unknown } }).data?.message === "string"
  ) {
    return (error as { data: { message: string } }).data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const formatDateTime = (value?: string) => {
  if (!value) return "--";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "--";
  }
};

const AdminBloodBankPage = () => {
  const { data: inventories = [], isLoading, refetch } =
    useGetBloodInventoriesQuery();
  useGetInventorySummaryQuery();

  const [createInventory, { isLoading: isCreating }] =
    useCreateBloodInventoryMutation();
  const [updateInventory, { isLoading: isUpdating }] =
    useUpdateBloodInventoryMutation();
  const [adjustInventory, { isLoading: isAdjusting }] =
    useAdjustBloodInventoryMutation();
  const [deleteInventory, { isLoading: isDeleting }] =
    useDeleteBloodInventoryMutation();

  const [inventoryForm, setInventoryForm] = useState<InventoryFormState>(
    initialInventoryForm
  );
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(
    null
  );
  const [adjustForm, setAdjustForm] = useState<AdjustFormState>(
    initialAdjustForm
  );

  const lowStockGroups = useMemo(() => {
    return new Set(
      inventories
        .filter(
          (item) =>
            typeof item.minimumThreshold === "number" &&
            item.unitsAvailable <= (item.minimumThreshold ?? 0)
        )
        .map((item) => item.bloodGroup)
    );
  }, [inventories]);

  const handleInventorySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inventoryForm.bloodGroup) {
      toast.error("Select a blood group");
      return;
    }

    const existing = inventories.find(
      (item) => item.bloodGroup === inventoryForm.bloodGroup
    );

    const parsedThreshold = inventoryForm.minimumThreshold
      ? Number(inventoryForm.minimumThreshold)
      : undefined;

    if (Number.isNaN(parsedThreshold as number)) {
      toast.error("Minimum threshold must be a number");
      return;
    }

    const parsedUnits = inventoryForm.units
      ? Number(inventoryForm.units)
      : undefined;

    if (!existing && (parsedUnits === undefined || Number.isNaN(parsedUnits))) {
      toast.error("Initial units are required for a new blood group");
      return;
    }

    try {
      if (existing && selectedInventoryId) {
        const payload: Record<string, unknown> = {};
        if (!Number.isNaN(parsedUnits as number) && inventoryForm.units !== "") {
          payload.unitsAvailable = parsedUnits;
        }
        if (!Number.isNaN(parsedThreshold as number)) {
          payload.minimumThreshold = parsedThreshold;
        }
        if (inventoryForm.notes.trim().length > 0 || existing.notes) {
          payload.notes = inventoryForm.notes.trim();
        }
        await updateInventory({ id: selectedInventoryId, data: payload }).unwrap();
        toast.success("Inventory updated");
      } else {
        await createInventory({
          bloodGroup: inventoryForm.bloodGroup,
          unitsAvailable: parsedUnits ?? 0,
          minimumThreshold: parsedThreshold,
          notes: inventoryForm.notes.trim() || undefined,
        }).unwrap();
        toast.success("Inventory created");
      }
      setInventoryForm(initialInventoryForm);
      setSelectedInventoryId(null);
      await refetch();
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to save inventory"));
    }
  };

  const handleInventoryEdit = (id: string) => {
    const record = inventories.find((item) => item._id === id);
    if (!record) return;
    setSelectedInventoryId(record._id);
    setInventoryForm({
      bloodGroup: record.bloodGroup,
      units: String(record.unitsAvailable),
      minimumThreshold: record.minimumThreshold?.toString() ?? "",
      notes: record.notes ?? "",
    });
  };

  const handleAdjustSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number(adjustForm.adjustBy);
    if (!adjustForm.inventoryId && !adjustForm.bloodGroup) {
      toast.error("Select a blood group to adjust");
      return;
    }
    if (!Number.isFinite(value) || value === 0) {
      toast.error("Adjustment must be a non-zero number");
      return;
    }

    try {
      await adjustInventory({
        inventoryId: adjustForm.inventoryId,
        bloodGroup: adjustForm.bloodGroup,
        adjustBy: value,
        note: adjustForm.note.trim() || undefined,
      }).unwrap();
      toast.success("Inventory adjusted");
      setAdjustForm(initialAdjustForm);
      await refetch();
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to adjust inventory"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventory(id).unwrap();
      toast.success("Inventory deleted");
      await refetch();
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to delete inventory"));
    }
  };

  return (
    <div className="space-y-10 p-6">
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="shadow-sm border border-slate-200/70">
          <CardHeader>
            <CardTitle>Blood Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-slate-500">Loading inventory...</p>
            ) : inventories.length === 0 ? (
              <p className="text-sm text-slate-500">
                No inventory records yet. Create one using the form on the right.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Units Available</TableHead>
                      <TableHead>Threshold</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Restock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventories.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-semibold text-slate-800">
                          {item.bloodGroup}
                        </TableCell>
                        <TableCell>{item.unitsAvailable}</TableCell>
                        <TableCell>{item.minimumThreshold ?? 0}</TableCell>
                        <TableCell>
                          {lowStockGroups.has(item.bloodGroup) ? (
                            <Badge variant="destructive">Low</Badge>
                          ) : (
                            <Badge variant="secondary">Healthy</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDateTime(item.lastRestockedAt)}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInventoryEdit(item._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-violet-200/60 shadow-sm">
            <CardHeader>
              <CardTitle>
                {selectedInventoryId ? "Update Inventory" : "Create Inventory"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleInventorySubmit}>
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={inventoryForm.bloodGroup}
                    onValueChange={(value) =>
                      setInventoryForm((prev) => ({ ...prev, bloodGroup: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{selectedInventoryId ? "Set Units" : "Initial Units"}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={inventoryForm.units}
                    onChange={(event) =>
                      setInventoryForm((prev) => ({
                        ...prev,
                        units: event.target.value,
                      }))
                    }
                    placeholder="e.g. 12"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Minimum Threshold</Label>
                  <Input
                    type="number"
                    min={0}
                    value={inventoryForm.minimumThreshold}
                    onChange={(event) =>
                      setInventoryForm((prev) => ({
                        ...prev,
                        minimumThreshold: event.target.value,
                      }))
                    }
                    placeholder="e.g. 5"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input
                    value={inventoryForm.notes}
                    onChange={(event) =>
                      setInventoryForm((prev) => ({
                        ...prev,
                        notes: event.target.value,
                      }))
                    }
                    placeholder="Optional notes"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="w-full"
                  >
                    {selectedInventoryId ? "Save Changes" : "Create"}
                  </Button>
                  {selectedInventoryId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedInventoryId(null);
                        setInventoryForm(initialInventoryForm);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border border-emerald-200/60 shadow-sm">
            <CardHeader>
              <CardTitle>Adjust Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleAdjustSubmit}>
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={
                      adjustForm.inventoryId || adjustForm.bloodGroup || ""
                    }
                    onValueChange={(value) => {
                      const inventory = inventories.find((item) => item._id === value);
                      if (inventory) {
                        setAdjustForm((prev) => ({
                          ...prev,
                          inventoryId: inventory._id,
                          bloodGroup: inventory.bloodGroup,
                        }));
                      } else {
                        setAdjustForm((prev) => ({
                          ...prev,
                          inventoryId: undefined,
                          bloodGroup: value,
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select inventory" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventories.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.bloodGroup} (available: {item.unitsAvailable})
                        </SelectItem>
                      ))}
                      <SelectItem value="new">
                        New blood group (specify below)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!adjustForm.inventoryId && (
                  <div className="space-y-2">
                    <Label>Blood Group (if new)</Label>
                    <Select
                      value={adjustForm.bloodGroup || ""}
                      onValueChange={(value) =>
                        setAdjustForm((prev) => ({ ...prev, bloodGroup: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>
                    Units (use negative values to release/consume stock)
                  </Label>
                  <Input
                    type="number"
                    value={adjustForm.adjustBy}
                    onChange={(event) =>
                      setAdjustForm((prev) => ({
                        ...prev,
                        adjustBy: event.target.value,
                      }))
                    }
                    placeholder="e.g. 5 or -2"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Note</Label>
                  <Input
                    value={adjustForm.note}
                    onChange={(event) =>
                      setAdjustForm((prev) => ({
                        ...prev,
                        note: event.target.value,
                      }))
                    }
                    placeholder="e.g. Restock from donor"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAdjusting}
                >
                  Apply Adjustment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBloodBankPage;
