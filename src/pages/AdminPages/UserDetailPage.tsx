import { updateUserById } from "@/api";
import AdminCard from "@/components/AdminCard";
import AdminPageHeader from "@/components/AdminPageHeader";
import { useAdminUsers, User } from "@/context/AdminUsersContext"
import { Button, Card, Loader, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function UserDetailPage() {
  const { user, isFetchingUser, userStatus, refetchUser } = useAdminUsers();

  const breadcrumbs: { title: string, href: string }[] = [
    { title: "Users", href: "/admin/users" },
    { title: user ? user.email! : '', href: "#"}
  ]

  const form = useForm({
    mode: 'uncontrolled',
    name: 'user-details-form',
    initialValues: {
      ...user,
    }
  })

  const { mutate } = useMutation({
    mutationFn: (payload: User) => updateUserById(payload),
    onSuccess: (res: any) => {
      refetchUser();
    },
    onError: (res: any) => {
      console.log('error: ', res);
    }
  })

  const handleUpdate = (data: any) => {
    mutate(data);
  }

  useEffect(() => {
    if (user) {
      form.setValues({...user})
    }
  }, [user])

  return (
    <div className="user-detail-page w-full p-4">
      {user && userStatus === 'success'
        ? (
          <form onSubmit={form.onSubmit(handleUpdate)} className="w-full">
            <div className="mb-4">
              <AdminPageHeader
                crumbs={breadcrumbs}
                backURL={`/admin/users`} 
                title={`User Details: ${user ? user.email : ''}`} 
              >
                <Button variant="light">Update</Button>
              </AdminPageHeader>
            </div>
            <div className="w-full text-sm mb-4">
              <AdminCard className="w-full">
                <p className="text-2xl mb-4">Account</p>
                <div className="flex gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center w-full gap-4">
                      <span className="w-[150px] m-0">Status:</span>
                      <Select
                        key={form.key('status')}
                        placeholder="Status"
                        data={['All', 'approved', 'pending']}
                        {...form.getInputProps('status')}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="w-[150px] m-0">Role:</span>
                      <Select
                        key={form.key('role')}
                        placeholder="Role"
                        data={['users', 'admin', 'developer']}
                        {...form.getInputProps('role')}
                      />
                    </div>  
                  </div>

                  <div className="flex-1 w-full">
                    <Button variant="filled" color="red">Change Password!</Button>
                  </div>
                  
                </div>
                
              </AdminCard>
            </div>
            <div className="flex flex-wrap lg:flex-nowrap w-full gap-4 text-sm mb-4">
              <AdminCard className="flex-none lg:flex-1 w-full">
                <p className="text-2xl mb-4">Contact</p>
                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">First Name:</span>
                  <TextInput
                    placeholder="First Name"
                    key={form.key('first_name')}
                    {...form.getInputProps('first_name')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Last Name:</span>
                  <TextInput
                    placeholder="Last Name"
                    key={form.key('last_name')}
                    {...form.getInputProps('last_name')}
                    className="flex-1 text-xs"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Email:</span>
                  <TextInput
                    placeholder="Email"
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Phone:</span>
                  <TextInput
                    placeholder="Phone"
                    key={form.key('phone')}
                    {...form.getInputProps('phone')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Username:</span>
                  <TextInput
                    placeholder="Username"
                    key={form.key('username')}
                    {...form.getInputProps('username')}
                    className="flex-1 text-xs"
                  />
                </div>
                
              </AdminCard>
              <AdminCard className="flex-none lg:flex-1 w-full">
                <p className="text-2xl mb-4">Business</p>
                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Company:</span>
                  <TextInput
                    placeholder="Company"
                    key={form.key('company')}
                    {...form.getInputProps('company')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Seller Permit:</span>
                  <TextInput
                    placeholder="Seller Permit"
                    key={form.key('seller_permit')}
                    {...form.getInputProps('seller_permit')}
                    className="flex-1 text-xs"
                  />
                </div>
                <div className="flex items-center gap-4 py-2">
                  <span className="w-[150px] m-0">Email:</span>
                  <div>
                    {user && user.seller_permit_files && user.seller_permit_files.map((item, index) => (
                      <p className="cursor-pointer">File: {index+1}</p>
                    ))}
                  </div>
                </div>
                
              </AdminCard>
            </div>

            <div className="flex flex-wrap lg:flex-nowrap w-full gap-4 text-sm">
              <AdminCard className="flex-none lg:flex-1 w-full">
                <p className="text-2xl mb-4">Billing Address</p>
                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">First Name:</span>
                  <TextInput
                    placeholder="First Name"
                    key={form.key('first_name')}
                    {...form.getInputProps('first_name')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Last Name:</span>
                  <TextInput
                    placeholder="Last Name"
                    key={form.key('last_name')}
                    {...form.getInputProps('last_name')}
                    className="flex-1 text-xs"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Address:</span>
                  <TextInput
                    placeholder="Address"
                    key={form.key('address')}
                    {...form.getInputProps('address')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Address2:</span>
                  <TextInput
                    placeholder="Address2"
                    key={form.key('address2')}
                    {...form.getInputProps('address2')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">City:</span>
                  <TextInput
                    placeholder="City"
                    key={form.key('city')}
                    {...form.getInputProps('city')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">State:</span>
                  <TextInput
                    placeholder="State"
                    key={form.key('state')}
                    {...form.getInputProps('state')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Zip:</span>
                  <TextInput
                    placeholder="Zip"
                    key={form.key('zip')}
                    {...form.getInputProps('zip')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Country:</span>
                  <TextInput
                    placeholder="Country"
                    key={form.key('country')}
                    {...form.getInputProps('country')}
                    className="flex-1 text-xs"
                  />
                </div>
              </AdminCard>

              <AdminCard className="flex-none lg:flex-1 w-full">
                <p className="text-2xl mb-4">Shipping Address</p>
                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">First Name:</span>
                  <TextInput
                    placeholder="First Name"
                    key={form.key('shipping_first_name')}
                    {...form.getInputProps('shipping_first_name')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Last Name:</span>
                  <TextInput
                    placeholder="Last Name"
                    key={form.key('shipping_last_name')}
                    {...form.getInputProps('shipping_last_name')}
                    className="flex-1 text-xs"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Address:</span>
                  <TextInput
                    placeholder="Address"
                    key={form.key('shipping_address')}
                    {...form.getInputProps('shipping_address')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Address2:</span>
                  <TextInput
                    placeholder="Address2"
                    key={form.key('shipping_address2')}
                    {...form.getInputProps('shipping_address2')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">City:</span>
                  <TextInput
                    placeholder="City"
                    key={form.key('shipping_city')}
                    {...form.getInputProps('shipping_city')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">State:</span>
                  <TextInput
                    placeholder="State"
                    key={form.key('shipping_state')}
                    {...form.getInputProps('shipping_state')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Zip:</span>
                  <TextInput
                    placeholder="Zip"
                    key={form.key('shipping_zip')}
                    {...form.getInputProps('shipping_zip')}
                    className="flex-1 text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-[150px] m-0">Country:</span>
                  <TextInput
                    placeholder="Country"
                    key={form.key('shipping_country')}
                    {...form.getInputProps('shipping_country')}
                    className="flex-1 text-xs"
                  />
                </div>
              </AdminCard>
            </div>
          </form>
        )
        : (
          <Loader />
        )
      }
    </div>
  )
}