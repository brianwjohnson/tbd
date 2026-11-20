import { Menu } from "./types/types";

function Menus() {
  const res: Menu[] = [
    {
      name: "Learn",
      authRequired: false,
      subMenu: [
        {
          name: "Fundamentals",
          desc: "Fundamentals",
          icon: "user-pen",
          path: "/info/fundamentals",
          method: "GET",
        },
        {
          name: "Up The Ante",
          desc: "TBD",
          icon: "users",
          path: "/info/uptheante",
          method: "GET",
        },
        {
          name: "Capitalist Roots",
          desc: "TBD",
          icon: "users",
          path: "/info/growth",
          method: "GET",
        },
        {
          name: "Admin",
          desc: "Admin console",
          icon: "users",
          path: "/admin",
          method: "GET",
          authRequired: true,
          roles: ["admin"],
        },
      ],
      gridCols: 1,
      path: "/info",
    },
    {
      name: "Explore",
      authRequired: false,
      subMenu: [
        {
          name: "Services",
          desc: "Find community service providers",
          icon: "users",
          path: "/services",
          method: "GET",
        },
      ],
      gridCols: 1,
      path: "/entities",
    },
    {
      name: "Donate",
      authRequired: false,
      subMenu: [
        {
          name: "Donate",
          desc: "View your profile",
          icon: "user-pen",
          path: "/donate",
          method: "GET",
          authRequired: false,
        },
        {
          name: "Receipts",
          desc: "Receipts",
          icon: "users",
          path: "/receipts",
          method: "GET",
          authRequired: true,
        },
      ],
      gridCols: 1,
      path: "/donate",
    },
    // {
    //   name: "Account",
    //   authRequired: true,
    //   subMenu: [
    //     {
    //       name: "Profile",
    //       desc: "View your profile",
    //       icon: "user-pen",
    //       path: "/account",
    //       method: "GET",
    //       authRequired: true,
    //     },
    //     {
    //       name: "Users",
    //       desc: "TBD",
    //       icon: "users",
    //       path: "/users",
    //       method: "GET",
    //       authRequired: true,
    //     },
    //     {
    //       name: "Logout",
    //       desc: "sign out",
    //       icon: "users",
    //       path: "/auth/signout",
    //       method: "POST",
    //       authRequired: true,
    //     },
    //   ],
    //   gridCols: 1,
    //   path: "/account",
    // },
  ];

  return res;
}

export default Menus;
