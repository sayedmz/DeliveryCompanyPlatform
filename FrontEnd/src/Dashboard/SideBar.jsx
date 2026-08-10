import React from "react";
import "../css/sideBar.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SideBar() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>

      <ul className="sidebar-links">
        <li>
          <NavLink to="/dashboard/orders">Orders</NavLink>
        </li>
        {user.role === "admin" && (
          <>
            <li>
              <NavLink to="/dashboard/register">create User</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/driver">Driver</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/addOrder">addOrder</NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default SideBar;
// import React, { useEffect, useState } from "react";
// import "../css/sideBar.css";
// import { NavLink } from "react-router-dom";
// import axios from "axios";

// const API_BASE = "http://localhost:8000/api";

// function SideBar() {
//   const [user, setUser] = useState(null);
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/drivers", {
//           withCredentials: true,
//         });
//         // const list;s
//         console.log(response.data);
//         setUser(response.data);
//       } catch (error) {
//         console.error("Failed to load logged-in user", error);
//       }
//     };

//     fetchUser();
//   }, []);

//   const isAdmin = user?.role === "admin";

//   return (
//     <div className="sidebar">
//       <h2 className="sidebar-title">Dashboard</h2>

//       <ul className="sidebar-links">
//         {isAdmin && (
//           <>
//             <li>
//               <NavLink to="/dashboard/register">Create User</NavLink>
//             </li>

//             <li>
//               <NavLink to="/dashboard/driver">Drivers</NavLink>
//             </li>

//             <li>
//               <NavLink to="/dashboard/addOrder">Add Order</NavLink>
//             </li>
//           </>
//         )}

//         <li>
//           <NavLink to="/dashboard/orders">Orders</NavLink>
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default SideBar;
