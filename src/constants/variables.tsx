// src/constants/constants.ts
import logo from '../assets/AFEAPCAWhite.png';

export const APP_LOGO = logo;
export const supportEmail = 'elizabeth.shaw@afepartner.com';
export const resendOTPCoolDown = 30;
export const otpLength = 6;
export const countries = ['United States', 'Canada', 'Mexico'];
export const superUserPermission = 1;
export const viewOperatedAFEPermission = 2;
export const viewNonOpAFEPermission = 3;
export const operatorEditUsers = 4;
export const nonOperatorEditUsers = 5;
export const approveRejectNonOpAFEs = 6;
export const viewOperatorBilling = 7;
export const editOperatorLibrary = 8;
export const editNonOpLibrary = 9;

//Webpage Navigation
export const mainNavigation = [
  {
    id: 1, name: 'Home', href: ""
  },
  {
    id: 2, name: 'How it Works', href: "howitworks"
  },
  {
    id: 3, name: 'Questions', href: "faq"
  },
  {
    id: 4, name: 'About Us', href: "aboutus"
  },
  {
    id: 5, name: 'Request a Demo', href: "requestdemo"
  },
];
export const WEBSITE_NAVIGATION = [
    {
    id:1,
    title: 'Solutions',
    subItems: [
      { id: 1, name: 'How It Works', href: 'howitworks' },
      //{ id: 2, name: 'AFE Systems', href: 'aboutus' },
    ]},
    {
    id:2,
    title: 'Support',
    subItems: [
      { id: 1, name: 'Contact Support', href: 'contactsupport' },
      { id: 2, name: 'FAQ', href: 'faq' },
    ]},
    {
    id:3,
    title: 'Company',
    subItems: [
      { id: 1, name: 'About', href: 'aboutus' },
    ]}, 
];


//molfettadesign