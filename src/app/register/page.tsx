import RegisterForm from '@/components/modules/auth/register/RegisterForm';
import React from 'react';

const Register = () => {
    return (
        <div className='flex justify-center bg-red-500 items-center content-center w-screen h-screen'>
            <RegisterForm></RegisterForm>
        </div>
    );
};

export default Register;