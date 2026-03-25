import React from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { Dropdown, DropdownItem } from "flowbite-react";
import logo from "../../assets/logo1.png";
import doctor from "../../assets/doctor.png";
import user from "../../assets/user.png";
import admin from "../../assets/admin.png";

export default function NavbarComponent() {
  const roles = [
    { name: "Admin", icon: admin },
    { name: "Doctor", icon: doctor },
    { name: "User", icon: user },
  ];

  return (
    <>
      <Navbar fluid rounded>
        <NavbarBrand>
          <img src={logo} className="mr-3 h-6 sm:h-9" alt="MediFlow Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            MediCare
          </span>
        </NavbarBrand>
        <div className="flex md:order-2 gap-2 px">

        {/* login */}
          <Button color="alternative">
            <Dropdown label="Login" inline>
              {roles.map((role) => (
                <DropdownItem key={role.name}>
                  <div className="flex items-center gap-2">
                    <img
                      src={role.icon}
                      alt={role.name}
                      className="w-5 h-5 object-contain"
                    />
                    <span>{role.name}</span>
                  </div>
                </DropdownItem>
              ))}
            </Dropdown>
          </Button>


          {/* register */}
          <Button color="purple">
            <Dropdown label="Register" inline>
              {roles.map((role) => (
                <DropdownItem key={role.name}>
                  <div className="flex items-center gap-2">
                    <img
                      src={role.icon}
                      alt={role.name}
                      className="w-5 h-5 object-contain"
                    />
                    <span>{role.name}</span>
                  </div>
                </DropdownItem>
              ))}
            </Dropdown>
          </Button>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="#" className="text-base">
            Home
          </NavbarLink>
          <NavbarLink href="#" className="text-base">
            About
          </NavbarLink>
          <NavbarLink href="#" className="text-base">
            Services
          </NavbarLink>
          <NavbarLink href="#" className="text-base">
            Contact
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>
    </>
  );
}
