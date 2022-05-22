import React, { useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { SingIn } from "../pages/LogIn";
import { AuthApp } from "./AuthApp";
import { DrawerApp } from "./DrawerApp";

export function Route() {
  const { user } = useAuth();

  return user ? <DrawerApp /> : <SingIn />;
}
