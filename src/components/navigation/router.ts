import {
  ApiOutlined,
  BankOutlined,
  CompassOutlined,
  ControlOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  ProfileOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import ObjectHelper from "../../helpers/object-helper";

type Route = {
  route?: string;
  label: string | React.ReactNode | React.ReactNode[];
  key?: string;
  children?: Route[] | null;
  icon?: React.ReactNode;
  name: string;
}

const mainAppRoutes: Route[] = [
  {
    name: "dashboard",
    label: "My Drive",
    route: "/dashboard",
    icon: React.createElement(CompassOutlined)
  },
  {
    name: "items",
    label: "Items",
    route: "/items",
    icon: React.createElement(FileTextOutlined)
  },
  {
    name: "folders",
    label: "Folders",
    icon: React.createElement(FolderOpenOutlined),
    children: [
      {
        name: "allFolders",
        label: "Folders",
        route: "/folders",
      },
      {
        name: "myFolders",
        label: "My Folders",
        route: "/my-folders"
      },
      {
        name: "createFolder",
        label: "Create Folder",
        icon: React.createElement(FolderAddOutlined),
      },
    ]
  },
  {
    name: "applications",
    label: "Applications",
    icon: React.createElement(ApiOutlined),
    children: [
      {
        name: "myApplications",
        label: "Applications",
        route: "/applications"
      },
      {
        name: "apiDocs",
        label: "API Docs",
        route: "/applications/api-docs"
      }
    ]
  },
  {
    icon: React.createElement(DeleteOutlined),
    name: "deletedFiles",
    label: "Deleted Files",
    route: "/deleted-files",
  },
]

const adminAppRoutes: Route[] = [
  {
  name: "admin",
  label: "Admin",
  icon: React.createElement(BankOutlined),
  children: [
    {
      name: "adminUsers",
      label: "Users",
      route: "/admin/users",
      icon: React.createElement(UserSwitchOutlined)
    },
    {
      name: "adminApplications",
      label: "Applications",
      route: "/admin/applications",
      icon: React.createElement(ControlOutlined)
    },
    {
      name: "adminFiles",
      label: "Files",
      icon: React.createElement(ProfileOutlined),
      children: [
        {
          name: "adminDeletedFiles",
          label: "Deleted files",
          route: "/admin/deleted-files",
          icon: React.createElement(DeleteOutlined),
        }
      ]
    }
  ]
}
];

const defaultAppRoutesLabelsDescribed = {
  dashboard: {
    name: "dashboard",
    label: React.createElement(Link, {to: "/dashboard"}, "Dashboard")
  },
  items: {
    name: "items",
    label: React.createElement(Link, {to: "/items"}, "Files")
  },
  allFolders: {
    name: "allFolders",
    label: React.createElement(Link, {to: "/folders"}, "Folders")
  },
  myFolderS: {
    name: "myFolders",
    label: React.createElement(Link, {to: "/my-folders"}, "My Folders")
  },
  myApplications: {
    name: "myApplications",
    label: React.createElement(Link, {to: "/applications"}, "Applications")
  },
  apiDocs: {
    name: "apiDocs",
    label: React.createElement(Link, {to: "/applications/api-docs"}, "API Docs")
  },
  deletedFiles: {
    name: "deletedFiles",
    label: React.createElement(Link, {to: "/deleted-files"}, "Deleted files")
  },
  createFolder: {
    name: "createFolder",
    label: React.createElement(FolderAddOutlined, {},"Create Folder")
  },
  admin: {
    name: "admin",
  },
  adminUsers: {
    name: "adminUsers",
    label: React.createElement(Link, {to: "/admin/users"}, "Users")
  },
  adminApplications: {
    name: "adminApplications",
    label: React.createElement(Link, {to: "/admin/applications"}, "Applications"),
  },
  adminFiles: {
    name: "adminFiles",
    label: "Files",
  },
  adminDeletedFiles: {
    name: "adminDeletedFiles",
    label: React.createElement(Link, {to: "/admin/deleted-files"}, "Deleted Files"),
  },
}

const defaultAppRoutesLabels = ObjectHelper.values(defaultAppRoutesLabelsDescribed);

type MenuItem = {
  key: string;
  label: string | React.ReactNode | undefined;
  icon: React.ReactNode;
  children?: MenuItem[];
}

function buildAppRoutes(routes: Route[], routerLinks: Route[], parentIndex?: string) {
  const keyRoutes: Route[] = [];
  const menuItems: MenuItem[] = [];
  let flatRoutes: Route[] = []

  routes.forEach((route, index) => {
    const routeNumber = index + 1;

    const keyRoute = { ...route };
    keyRoute.key = parentIndex ? `${parentIndex}.${routeNumber}` : `${routeNumber}`;
    keyRoute.label = routerLinks.find((link) => link.name === route.name)?.label || keyRoute.label;

    const menuItem: MenuItem = {key: keyRoute.key, label: keyRoute.label, icon: keyRoute.icon, children: undefined};
    flatRoutes.push(keyRoute);

    const {children} = route;

    if (children) {
      const resolvedChildrenRoutes = buildAppRoutes(children, routerLinks, keyRoute.key);

      keyRoute.children = resolvedChildrenRoutes.keyRoutes;
      menuItem.children = resolvedChildrenRoutes.menuItems;
      flatRoutes = flatRoutes.concat(resolvedChildrenRoutes.flatRoutes);
    }

    menuItems.push(menuItem);
    keyRoutes.push(keyRoute);
  });

  return {keyRoutes, flatRoutes, menuItems};
}

export type {Route};
export {buildAppRoutes, mainAppRoutes, defaultAppRoutesLabels, defaultAppRoutesLabelsDescribed, adminAppRoutes}
