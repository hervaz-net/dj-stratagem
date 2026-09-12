import { useState } from "react";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import Seo from "../components/Seo";
import { IconMap, IconChat, IconClock, IconCheck } from "../components/icons";

const roleOptions = ["General Contractor", "Subcontractor", "Supplier", "Engineer", "Other"];
const MESSAGE_MAX = 1000;
const MAILTO = "hello@djstratageminc.com";

const inputClass =
  "w-full rounded-md border bg-ink px-3.5 py-2.5 text-sm text-paper outline-hidden transition-colors " +
  "placeholder:text-steel/70 focus:border-amber";

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.company.trim()) errors.company = "Please enter your company.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!/^[\s@]+@[\s@]+\.[\s@]+$/.test(values.email))
    errors.email = "That doesn't look like a valid email address.";
  if (values.phone && !/^[\d\s()+.-]{7,}$/.test(values.phone))
    errors.phone = "Please enter a valid phone number.";
  return errors;
}
