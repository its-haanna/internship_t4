import React from "react";
import Axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

function Dashboard() {
  Axios.defaults.withCredentials = true;
  const [tableData, setTableData] = React.useState([]);
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  React.useEffect(() => {
    Axios.get("http://localhost:3001/dashboard").then((response) => {
      setTableData(
        response.data.map((item) => {
          const { id, username, name, email, registration, login, status } =
            item;
          return {
            id: id,
            username: username,
            name: name,
            email: email,
            registration: registration,
            login: login,
            status: status,
          };
        })
      );
    });
  });

  const tableHtml = tableData.map((row, i) => {
    return (
      <tr key={i}>
        <td className="border border-black text-center">
          <input
            type="checkbox"
            name="checkbox"
            value={row.id}
            onClick={() => getSelectedUsers()}
            readOnly
          />
        </td>
        <td className="border border-black px-2 py-4">{row.id}</td>
        <td className="border border-black px-2 py-4">{row.name}</td>
        <td className="border border-black px-2 py-4">{row.email}</td>
        <td className="border border-black px-2 py-4">{row.login}</td>
        <td className="border border-black px-2 py-4">{row.registration}</td>
        <td className="border border-black px-2 py-4">{row.status}</td>
      </tr>
    );
  });

  function toggle(source) {
    const allCheckboxes = document.querySelectorAll("input[name=checkbox]");
    const rowId = [];
    for (let i = 0; i < allCheckboxes.length; i++) {
      allCheckboxes[i].checked = source.target.checked;
      if (source.target.checked) {
        rowId.push(Number(allCheckboxes[i].value));
      }
    }
    setSelectedUsers(rowId);
  }

  function getSelectedUsers() {
    const rowId = [];
    const checkboxes = document.querySelectorAll(
      "input[type=checkbox]:checked"
    );
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].value === "selectAll") {
        break;
      } else {
        rowId.push(Number(checkboxes[i].value));
      }
    }
    setSelectedUsers(rowId);
  }

  function deleteUsers(arr) {
    arr.map((id) => {
      Axios.delete(`http://localhost:3001/dashboard/remove/${id}`).then(
        (response) => {}
      );
    });
  }

  function blockUsers(arr) {
    arr.map((id) => {
      Axios.post(`http://localhost:3001/dashboard/block/${id}`).then(
        (response) => {}
      );
    });
  }

  function unblockUsers(arr) {
    arr.map((id) => {
      Axios.post(`http://localhost:3001/dashboard/unblock/${id}`).then(
        (response) => {}
      );
    });
  }

  return (
    <div className="bg-sky-100 p-10 font-sans rounded flex flex-col text-neutral-900">
      <div className="min-w-full mb-6">
        <button
          onClick={() => blockUsers(selectedUsers)}
          className="mr-3 px-4 py-2 bg-red-600 text-white rounded hover:shadow-md hover:scale-105 ease-in-out duration-300"
        >
          Block <LockIcon />
        </button>
        <button
          onClick={() => unblockUsers(selectedUsers)}
          className="mr-3 px-4 py-2 bg-sky-600 text-white rounded hover:shadow-md hover:scale-105 ease-in-out duration-300"
        >
          Unblock <LockOpenIcon />
        </button>
        <button
          onClick={() => deleteUsers(selectedUsers)}
          className="mr-3 px-4 py-2 bg-sky-600 text-white rounded hover:shadow-md hover:scale-105 ease-in-out duration-300"
        >
          Delete <DeleteOutlineOutlinedIcon />
        </button>
      </div>
      <table className="table-fixed border border-black">
        <thead className="table-header-group border border-black bg-sky-900 text-white">
          <tr>
            <th className="w-32 border border-black">
              <input
                type="checkbox"
                id="selectAll"
                name="selectAll"
                value="selectAll"
                className="mr-2"
                onChange={toggle}
              />
              Select All
            </th>
            <th className="w-32 border border-black py-6 px-4">ID</th>
            <th className="w-32 border border-black py-6 px-4">Name</th>
            <th className="w-32 border border-black py-6 px-4">E-mail</th>
            <th className="w-32 border border-black py-6 px-4">Last login</th>
            <th className="w-32 border border-black py-6 px-4">
              Registration time
            </th>
            <th className="w-32 border border-black py-6 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white">{tableHtml}</tbody>
      </table>
    </div>
  );
}

export default Dashboard;
