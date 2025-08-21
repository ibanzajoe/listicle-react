import { Button, Divider, Input, PasswordInput, TextInput } from "@mantine/core";
import { useState } from "react";
import { FaMicrosoft } from "react-icons/fa";
import { IconBrandFacebook, IconBrandGoogle, IconFingerprint, IconPasswordFingerprint, IconUserCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

type LoginRequest = {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [swapToRegistration, setSwapToRegistration] = useState<boolean>(false);
  const toggleRegistration = () => setSwapToRegistration((pv) => !pv);
  const [visible, { toggle }] = useDisclosure(false);

  const form = useForm({
    mode: 'uncontrolled',
    name: 'login-form',
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }
  })

  const { mutate: login, isPending: isLogginIn } = useMutation({
    mutationFn: (payload: LoginRequest) => api.post('/login', payload),
    onSuccess: (res: any) => {
      const user = res.data.user;
      setUser(user);
      localStorage.setItem('authToken', res.data.accessToken);
      navigate("/")
    },
    onError: (res: any) => {
      console.log('res: ', res);
    }
  })

  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: (payload: LoginRequest) => api.post('/auth/register', payload),
    onSuccess: (res: any) => {
      console.log('res: ', res);
    },
    onError: (res: any) => {
      console.log('res: ', res);
    }
  })

  const handleLogin = (payload: LoginRequest) => {
    if (swapToRegistration) {
      register(payload);
      return;
    }
    login(payload)
  }

  return (
    <div className="login-form w-full md:w-[400px] bg-sky-950 text-white py-6 px-8 rounded-[20px] shadow">
      {!swapToRegistration ? (
        <form onSubmit={form.onSubmit(handleLogin)} className="bg-transparent">
          <div className="flex flex-col">
            <h2 className="text-[42px] mb-6">Sign In</h2>
            <div className="flex flex-col gap-2 mb-4">
              <TextInput
                placeholder="email@domain.com"
                leftSection={<IconUserCircle />}
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                placeholder="Password"
                leftSection={<IconFingerprint />}
                visible={visible}
                onVisibilityChange={toggle}
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
            </div>
            <div className="flex items-center justify-end">
              <Button type="submit" color="red" variant="filled" loading={isLogginIn} fullWidth>Login</Button>
            </div>
            <Divider className="bg-gray-200 my-4" />
            <div className="flex items-center justify-center gap-6">
              <IconBrandGoogle className="cursor-pointer" />
              <IconBrandFacebook className="cursor-pointer" />
              <FaMicrosoft className="cursor-pointer" />
            </div>
            <Divider className="bg-gray-200 my-4" />
            <div className="flex items-center justify-end">
              <span onClick={toggleRegistration} className="text-xs cursor-pointer">Register</span>
            </div>
          </div>

        </form>
      ) : (
        <form onSubmit={form.onSubmit(handleLogin)} className="bg-transparent">
          <div className="flex flex-col">
            <h2 className="text-[42px] mb-6">Registration</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 w-full">
                <TextInput
                  placeholder="First Name"
                  key={form.key('first_name')}
                  {...form.getInputProps('first_name')}
                  className="flex-1 w-full"
                />
                <TextInput
                  placeholder="Last Name"
                  key={form.key('last_name')}
                  {...form.getInputProps('last_name')}
                  className="flex-1 w-full"
                />
              </div>
              <TextInput
                placeholder="email@domain.com"
                leftSection={<IconUserCircle />}
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                placeholder="Password"
                leftSection={<IconFingerprint />}
                visible={visible}
                onVisibilityChange={toggle}
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              <div className="flex items-center justify-end py-2">
                <Button type="submit" color="red" variant="filled" loading={isRegistering} fullWidth>Register</Button>
              </div>
            </div>
            <Divider className="bg-gray-200" />
            <div className="flex items-center justify-end pt-4">
              <span onClick={toggleRegistration} className="text-xs cursor-pointer">Sign In</span>
            </div>
          </div>

        </form>
      )}
    </div>
  )
}