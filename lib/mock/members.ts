import type { Member } from "@/lib/types";
import { daysAgo, monthsBefore } from "./clock";

/**
 * Three seeded members — docs/04-mock-data.md.
 * Every value is fabricated. No real person, UAN, employer or bank account.
 */

const priyaExit = daysAgo(80);
const rameshExit = daysAgo(53);
const arunExit = daysAgo(97);

export const MEMBERS: Member[] = [
  {
    uan: "100100100001",
    password: "demo1234",
    name: "Priya Raghavan",
    dobEpfo: "1996-11-03",
    dobAadhaar: "1996-11-03",
    nameEpfo: "PRIYA RAGHAVAN",
    namePan: "PRIYA RAGHAVAN",
    mobile: "98450 11204",
    employer: { name: "Kestrel Analytics Pvt Ltd", city: "Bengaluru" },
    dateOfJoining: monthsBefore(priyaExit, 49),
    dateOfExit: priyaExit,
    serviceMonths: 49,
    aadhaarSeeded: true,
    bankVerified: true,
    bankAccount: "XXXXXX7719",
    ifsc: "HDFC0001204",
    form15GFiled: false,
    balance: { employeeShare: 226540, employerShare: 191320, interest: 46907 },
    pensionableSalary: 15000,
  },
  {
    uan: "100100100002",
    password: "demo1234",
    name: "Ramesh Iyer",
    dobEpfo: "1985-08-27",
    dobAadhaar: "1985-08-27",
    nameEpfo: "RAMESH IYER",
    namePan: "RAMESH IYER",
    mobile: "98220 76318",
    employer: { name: "Meridian Tech Solutions Pvt Ltd", city: "Pune" },
    dateOfJoining: monthsBefore(rameshExit, 84),
    dateOfExit: rameshExit,
    serviceMonths: 84,
    aadhaarSeeded: true,
    bankVerified: true,
    bankAccount: "XXXXXX3055",
    ifsc: "ICIC0000431",
    form15GFiled: false,
    balance: { employeeShare: 584120, employerShare: 496880, interest: 152640 },
    pensionableSalary: 15000,
  },
  {
    uan: "100100100003",
    password: "demo1234",
    name: "Arun Deshpande",
    // The mismatch the whole demo turns on: one year apart.
    dobEpfo: "1994-04-12",
    dobAadhaar: "1993-04-12",
    nameEpfo: "ARUN DESHPANDE",
    namePan: "ARUN R DESHPANDE",
    mobile: "98765 43210",
    employer: { name: "Halcyon Retail India Pvt Ltd", city: "Hyderabad" },
    dateOfJoining: monthsBefore(arunExit, 38),
    dateOfExit: arunExit,
    serviceMonths: 38,
    aadhaarSeeded: true,
    bankVerified: true,
    bankAccount: "XXXXXX9142",
    ifsc: "SBIN0004512",
    form15GFiled: false,
    balance: { employeeShare: 342180, employerShare: 288940, interest: 71220 },
    pensionableSalary: 15000,
  },
];

export function findMember(uan: string): Member | undefined {
  return MEMBERS.find((m) => m.uan === uan);
}

export function authenticate(uan: string, password: string): Member | undefined {
  const member = findMember(uan.trim());
  return member && member.password === password ? member : undefined;
}

export function corpus(m: Member): number {
  return m.balance.employeeShare + m.balance.employerShare + m.balance.interest;
}
