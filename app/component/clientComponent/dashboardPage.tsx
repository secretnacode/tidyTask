"use client";

import {
  Archive,
  CircleHelp,
  CirclePlus,
  ClipboardList,
  House,
  UserRoundPen,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function Navbar() {
  const params = useParams();
  const userId = params.userId;
  return (
    <div className="bg-white min-h-screen max-h-fit w-[15%]">
      <Link
        href={`/${userId}`}
        className="flex flex-col justify-center items-center gap-2 p-3"
      >
        <svg
          id="logo-14"
          width="73"
          height="49"
          viewBox="0 0 73 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden sm:inline-flex"
        >
          {" "}
          <path
            d="M46.8676 24C46.8676 36.4264 36.794 46.5 24.3676 46.5C11.9413 46.5 1.86765 36.4264 1.86765 24C1.86765 11.5736 11.9413 1.5 24.3676 1.5C36.794 1.5 46.8676 11.5736 46.8676 24Z"
            className="ccustom"
            fill="#68DBFF"
          ></path>{" "}
          <path
            d="M71.1324 24C71.1324 36.4264 61.1574 46.5 48.8529 46.5C36.5484 46.5 26.5735 36.4264 26.5735 24C26.5735 11.5736 36.5484 1.5 48.8529 1.5C61.1574 1.5 71.1324 11.5736 71.1324 24Z"
            className="ccompli1"
            fill="#FF7917"
          ></path>{" "}
          <path
            d="M36.6705 42.8416C42.8109 38.8239 46.8676 31.8858 46.8676 24C46.8676 16.1144 42.8109 9.17614 36.6705 5.15854C30.5904 9.17614 26.5735 16.1144 26.5735 24C26.5735 31.8858 30.5904 38.8239 36.6705 42.8416Z"
            className="ccompli2"
            fill="#5D2C02"
          ></path>{" "}
        </svg>
        <span className="title">TaskTidy</span>
      </Link>
      <ul>
        <li>
          <Link href={`/${userId}`} className="nav-link">
            <House className="icon-nav" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href={`/${userId}/task`} className="nav-link">
            <ClipboardList className="icon-nav" />
            <span>Task</span>
          </Link>
        </li>
        <li>
          <Link href={`/${userId}/archive`} className="nav-link">
            <Archive className="icon-nav" />

            <span>Archive</span>
          </Link>
        </li>
        <li>
          <Link href={`/${userId}/faq`} className="nav-link">
            <CircleHelp className="icon-nav" />

            <span>Help / FAQ</span>
          </Link>
        </li>
        <li>
          <Link href={`/${userId}/profile`} className="nav-link">
            <UserRoundPen className="icon-nav" />

            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export function DashboardCreateButton() {
  const params = useParams();
  const userId = params.userId;
  return (
    <Link
      href={`/${userId}/task?action=createTask`}
      className="flex flex-row justify-center items-center gap-2 "
    >
      <p>Create Task</p>
      <CirclePlus />
    </Link>
  );
}

export function TodayTableTask() {
  const date = new Date().toISOString().split("T")[0];
  const params = useParams();
  const userId = params.userId;

  return (
    <div className="my-5 bg-white shadow-sm rounded-xl p-5">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center gap-2">
          <p className="text-lg font-black">Today task</p>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
        <Link href={`/${userId}/task`} className="text-md text-gray-500">
          See all
        </Link>
      </div>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Write Project Proposal</td>
            <td>In Progress</td>
            <td>2025-05-15</td>
            <td>High</td>
            <td>
              <button>Edit</button>
              <button>View</button>
            </td>
          </tr>
          <tr>
            <td>Design Mockups</td>
            <td>To Do</td>
            <td>2025-05-18</td>
            <td>Medium</td>
            <td>
              <button>Edit</button>
              <button>View</button>
            </td>
          </tr>
          <tr>
            <td>Implement User Auth</td>
            <td>Done</td>
            <td>2025-05-10</td>
            <td>High</td>
            <td>
              <button>View</button>
            </td>
          </tr>
          <tr>
            <td>Fix Bug #123</td>
            <td>Due</td>
            <td>2025-05-14</td>
            <td>High</td>
            <td>
              <button>Edit</button>
              <button>View</button>
            </td>
          </tr>
          <tr>
            <td>Review Documentation</td>
            <td>To Do</td>
            <td>2025-05-20</td>
            <td>Low</td>
            <td>
              <button>Edit</button>
              <button>View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
