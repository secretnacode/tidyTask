import { TaskStatusCardType } from "@/type";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";

export function UserLogo({ name }: { name: string }) {
  return (
    <div className="flex justify-end items-center gap-2">
      <p>{name}</p>
      <CircleUserRound className="stroke-[1] size-10" />
    </div>
  );
}

export function TaskStatusCard({
  logo: LogoIcon,
  status,
  count,
  name,
  style,
}: TaskStatusCardType) {
  return (
    <>
      {name ? (
        // this will display if the prop that pass was name instead of count
        <Link href="/" className={`${style} `}>
          <div>
            <span>
              <LogoIcon />
            </span>
          </div>
          <p>{status}</p>
          <p>{name} task</p>
        </Link>
      ) : (
        // this will display if the prop that pass were count instead of name
        <div className={`${style} shadow-xs`}>
          <div>
            <span>
              <LogoIcon />
            </span>
          </div>
          <p>{status}</p>
          <p>
            <span>
              {count} {count && count > 1 ? "tasks" : "task"}
            </span>
            <span>
              <Link href="/">See more</Link>
            </span>
          </p>
        </div>
      )}
    </>
  );
}
