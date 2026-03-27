import { useState, useEffect } from 'react'
import Navbar from '../../components/common/Navbar'
import Loader from '../../components/common/Loader'
import { getAllUsers } from '../../services/adminService'

const ManageUsers=()=>{
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllUsers()
        console.log(res);
        setUsers(res.data?.users || [])
      } catch {
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Simple frontend search filter
  const filtered = search
    ? users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.city?.toLowerCase().includes(search.toLowerCase())
      )
    : users

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Patients</h1>
            <p className="text-slate-500 text-sm">{users.length} registered patients</p>
          </div>
        </div>

        {/* Search */}
        <div className="card mb-6">
          <input
            className="input max-w-sm"
            placeholder="Search by name, email or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="card">
          {loading ? <Loader /> : filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-10 text-sm">No patients found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase border-b border-slate-100">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">City</th>
                    <th className="py-2 px-4 text-left">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-600 text-slate-800">{u.name}</td>
                      <td className="py-3 px-4 text-slate-500">{u.city}</td>
                      <td className="py-3 px-4 text-slate-500">
                        {u.gender === 'Male' ? 'Male' : u.gender === 'Female' ? 'Female' : u.gender}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



export default ManageUsers;