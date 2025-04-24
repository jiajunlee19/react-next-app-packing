import React from "react";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import portFolioImage from '@/public/portfolio.png';
import bominatorImage from '@/public/BOMinator.png';
import readyMSImage from '@/public/ReadyMS.png';
import bomProgramCreateImage from '@/public/bom-program-create.png';
import swrProgramCreateImage from '@/public/swr-program-create.png';
import pnpProgramCheckerImage from '@/public/pnp-program-checker.png';
import dataIngestionPipelineImage from '@/public/Data_Ingestion_Pipeline.png';
import automatedJIRAIssueCreationImage from '@/public/Automated_JIRA_Issue_Creation.png';
import reactNextAppPackingImage from '@/public/react-next-app-packing.png';
import reactNextAppTemplateImage from '@/public/react-next-app-template.png';
import reactNextAppCardGameImage from '@/public/react-next-app-card-game.png';

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experiences",
    hash: "#experiences",
  },
  {
    name: "Contacts",
    hash: "#contacts",
  },
] as const;

export const experiences = [
  {
    title: "Electrical & Electronic Engineering",
    location: "Universiti Sains Malaysia (USM), Penang, Malaysia",
    description:
      "I graduated as Bachelor Degree of Electrical & Electronic Engineering from USM with First Class Degree Honour CFGPA grade of 3.96 / 4.00 after 4 years of study.",
    icon: React.createElement(ArchiveBoxXMarkIcon, { className: "dark:fill-white" }),
    date: "2018 - 2020",
  },
  {
    title: "Senior SSD NPI Engineer",
    location: "Micron Technology, Penang, Malaysia",
    description:
      "I prototyped, developed, qualified and ramped both Client/Enterprise SSD Products from NPI to High-Volume-Manufacturing (HVM), with 100% NPI qualification success rate. I enabled Micron Penang with full-fledged capabilities by ramping the first Low-Temp Solder SSD,  first E3.S/U.2 Rigid-Flex Complex Form Factor SSDs, and first Gen 5 SSD with high capacity/performance. I improved Micron’s Capacity Flexibility by extending SSD qualification into Micron Batu Kawan, Penang as dual site qualification in parallel with Micron Prai, Penang.",
    icon: React.createElement(ArchiveBoxXMarkIcon, { className: "dark:fill-white" }),
    date: "2020 - Present",
  },
];

export const skills = [
  "Python",
  "UiPath RPA",
  "SQL",
  "Snowflake",
  "MSSQL",
  "Tableau",
  "PowerBI",
  "React",
  "Next.js",
  "Tailwind CSS",
  "TypeScript",
  "Git",
  "Bitbucket",
  "JIRA",
  "Confluence",
  "Docker",
  "Jenkins",
  "Vault",
] as const;

export const projects = [
  {
      title: "PortFolio | Jia Jun Lee",
      location: "Hobby Project",
      description: "A Web Application to show case Jia Jun Lee's Portfolio, built on top of Next.js by jiajunlee.",
      link: "/portfolio",
      tags: ["React", "Next.js", "Typescript", "Tailwind"],
      imageUrl: portFolioImage,
  },
  {
    title: "High Gain Automation Project - BOMinator (Automated MAM BOM Creator)",
    location: "Micron Technology, Penang, Malaysia",
    description: "BOMinator combines BOM (Bill of Materials) with Terminator, its an Automated MAM BOM Creator, effectively “terminates” the traditional manual, time-consuming, and error-prone aspects of BOM creation, developed with UiPath, Python and Snowflake, significantly reduced the time taken for BOM Creation, from >2 hours per BOM into <2 minutes per BOM. Project details are Micron Confidential, the link below might be access-restricted.",
    link: "/denied",
    tags: ["RPA", "UiPath", "Python", "Snowflake"],
    imageUrl: bominatorImage,
  },
  {
    title: "High Gain Automation Project - ReadyMS (Automated MAM / RMS Readiness Checker)",
    location: "Micron Technology, Penang, Malaysia",
    description: "ReadyMS combines Ready (Readiness) with MS (MAM System, with abbreviation of RMS (Recipe Management System). Its an Automated RMS/MAM Readiness Checker, designed to streamline and provide overview on MAM/RMS Readiness in Tableau Dashboard. User can easily check the overall readiness by BOM level. Project details are Micron Confidential, the link below might be access-restricted.",
    link: "/denied",
    tags: ["Python", "Snowflake", "Tableau"],
    imageUrl: readyMSImage,
  },
  {
    title: "Script-Automated non-Proto BOM Recipe Creation",
    location: "Micron Technology, Penang, Malaysia",
    description: "Leveraged algorithm of script-automated XML modification from master recipe, to generate non-proto recipes with improved recipe preparation time and license cost saved. Project details are Micron Confidential, the link below might be access-restricted.",
    link: "/denied",
    tags: ["Python", "SQL", "SMT Pick & Place"],
    imageUrl: bomProgramCreateImage,
  },
  {
    title: "Script-Automated SWR Recipe Creation",
    location: "Micron Technology, Penang, Malaysia",
    description: "Leveraged algorithm of script-automated XML modification from master recipe, to generate SWR recipes with improved recipe preparation time and license cost saved. Project details are Micron Confidential, the link below might be access-restricted.",
    link: "/denied",
    tags: ["Python", "SQL", "SMT Pick & Place"],
    imageUrl: swrProgramCreateImage,
  },
  {
    title: "Automated Recipe vs BOM Checking Algorithm",
    location: "Micron Technology, Penang, Malaysia",
    description: "Minimized quality events with scrap cost reduction by introducing Automated Recipe vs BOM Checking Algorithm, to ensure components mounted are correct on its corresponding designators. Project details are Micron Confidential, the link below might be access-restricted.",
    link: "/denied",
    tags: ["Python", "Snowflake", "SMT Pick & Place"],
    imageUrl: pnpProgramCheckerImage,
  },
  {
    title: "Data Ingestion Pipeline Design",
    location: "Micron Technology, Penang, Malaysia",
    description: "Designed Continuous full / incremental data ingestion ETL pipelines, integrated with Snowflake, to ease and automate reporting / analytical purposes.Project details are Micron Confidential, the link below might be access-restricted.",
    link: "/denied",
    tags: ["Python", "Snowflake"],
    imageUrl: dataIngestionPipelineImage,
  },
  {
    title: "Script-Automated JIRA Issue Creation for Reject Investigation",
    location: "Micron Technology, Penang, Malaysia",
    description: "Smoothen Engineer Investigation Workflow by script automating JIRA issue creation for every drive rejected with details populated, connected to Machine Data for 1st-level story-telling of the issue. Project details are Micron Confidential, the link below might be access-restricted.",
    link: "/denied",
    tags: ["Python", "JIRA"],
    imageUrl: automatedJIRAIssueCreationImage,
  },
  {
    title: "Packing and Shipment Traceability Web App",
    location: "Micron Technology, Penang, Malaysia",
    description: "Developed full-stack web app (MSSQL-React-NextJS) for SSD packing & shipment traceability, managing the creation and association of box UID - tray UID - lot UID - drive UID with its corresponding label generated. Project details are Micron Confidential, the link below might be access-restricted.",
    link: "/denied",
    tags: ["React", "Next.js", "Tailwind", "MSSQL"],
    imageUrl: reactNextAppPackingImage,
  },
  {
    title: "react-next-app-template",
    location: "Hobby Project",
    description: "A developer template of react-next-app, with best practices and methods to ease app development, built on top of Next.js by jiajunlee.",
    link: "https://github.com/jiajunlee19/react-next-app-template",
    tags: ["React", "Next.js", "Typescript", "PostgreSQL", "Tailwind", "Prisma", "Docker", "Jenkins"],
    imageUrl: reactNextAppTemplateImage,
},
{
  title: "react-next-app-card-game",
  location: "Hobby Project",
  description: "A card game collection, game plays and probability calculator, built on top of Next.js by jiajunlee.",
  link: "https://github.com/jiajunlee19/react-next-app-card-game",
  tags: ["React", "Next.js", "Typescript", "Tailwind"],
  imageUrl: reactNextAppCardGameImage,
},
] as const;