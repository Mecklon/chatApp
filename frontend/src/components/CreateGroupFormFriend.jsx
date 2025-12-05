import defaultAvatar from "../assets/defaultAvatar.webp";
import { normalizeTime } from "../normalizeTime";
import Image from "../hooks/Image";

function CreateGroupFormFriend({
  connection,
  setMembers,
  setAdmins,
  admins,
  members,
}) {

  const handleClick = () => {
    if (members.has(connection.name)) {
      setMembers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(connection.name);
        return newSet;
      });
      if (admins.has(connection.name)) {
        setAdmins((prev) => {
          const newSet = new Set(prev);
          newSet.delete(connection.name);
          return newSet;
        });
      }
    } else {
      setMembers((prev) => new Set([...prev, connection.name]));
    }
  };

  const handleAdminToggle = () => {
    setAdmins((prev) => {
      if (prev.has(connection.name)) {
        const newSet = new Set(prev);
        newSet.delete(connection.name);
        return newSet;
      } else {
        return new Set([...prev, connection.name]);
      }
    });
  };

  return (
    <label
      htmlFor={connection.id}
      className="flex gap-3 hover:bg-blue-300 duration-100 rounded-lg items-center p-2 py-1 checkBlue"
      key={connection.id}
    >
      <input defaultChecked={members.has(connection.name)} onClick={handleClick} id={connection.id} type="checkbox" />
      <Image
        className="h-14 w-14 rounded-full bg-red-300"
        path={connection.profileImgName}
        fallback={defaultAvatar}
      />
      <div className="flex justify-between grow">
        <div className="flex flex-col">
          <div className="font-medium">{connection.name}</div>
          <div className="text-sm">
            {connection.online
              ? "Online"
              : "Last seen, " + normalizeTime(connection.lastSeen)}
          </div>
        </div>
        {members.has(connection.name) && (
          <div className="flex gap-2 items-center">
            <div>Admin</div>
            <input
              defaultChecked={admins.has(connection.name)}
              onClick={handleAdminToggle}
              type="checkbox"
              className="customToggle"
            />
          </div>
        )}
      </div>
    </label>
  );
}

export default CreateGroupFormFriend;
