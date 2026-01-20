'use client';

// Imports removed

// Since I don't have a Checkbox component yet, I'll create a simple one inline or use native input.
// Reference image uses custom checkbox style. I'll use a native input styled or a div.
// For speed, let's stick to native input with tailwind class.

interface User {
    id: string;
    name: string;
    role: string;
}

interface UserSelectionListProps {
    users: User[];
    label: string;
    selectedIds: string[];
    onToggle: (id: string) => void;
}

export function UserSelectionList({ users, label, selectedIds, onToggle }: UserSelectionListProps) {
    return (
        <div className="w-full">
            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-800">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 text-sm font-medium text-gray-500">
                    {/* Header: User ... Role | Checkbox */}
                    <div className="flex justify-between">
                        <span>User</span>
                        <span>Select</span>
                    </div>
                </div>
                <div className="max-h-60 overflow-y-auto bg-white dark:bg-gray-950">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                            onClick={() => onToggle(user.id)}
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar placeholder if needed, ref image just has text "Yash Team lead" */}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                                    <span className="text-xs text-gray-500 italic">{user.role}</span>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(user.id)}
                                onChange={() => { }} // handled by parent div click
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
