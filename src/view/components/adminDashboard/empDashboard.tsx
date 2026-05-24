import { useEffect, useState } from 'react';
import empService from '../../../services/empService';
import deptService from '../../../services/deptService';
import '../../../styles/components/empDashboard.css';

export default function EmpDashboard() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('id:DESC');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    salary: 0,
    hireDate: new Date().toISOString().split('T')[0],
    departmentId: ''
  });

  const limit = 5;

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await empService.getAll(page, limit, search, sort);
      setEmployees(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const result = await deptService.getAll(1, 100);
      setDepartments(result.data);
    } catch (err) {
      console.error('Failed to fetch departments', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) fetchEmployees();
      else setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await empService.delete(id);
      fetchEmployees();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSort = (field: string) => {
    const [currentField, currentDir] = sort.split(':');
    if (currentField === field) {
      setSort(`${field}:${currentDir === 'ASC' ? 'DESC' : 'ASC'}`);
    } else {
      setSort(`${field}:ASC`);
    }
  };

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      salary: 0,
      hireDate: new Date().toISOString().split('T')[0],
      departmentId: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: any) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      salary: emp.salary,
      hireDate: emp.hireDate.split('T')[0],
      departmentId: emp.departmentId || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        departmentId: formData.departmentId || null,
        salary: Number(formData.salary)
      };
      if (editingEmployee) {
        await empService.update(editingEmployee.id, data);
      } else {
        await empService.create(data);
      }
      setIsFormOpen(false);
      fetchEmployees();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const renderSortIcon = (field: string) => {
    const [currentField, currentDir] = sort.split(':');
    if (currentField !== field) return null;
    return currentDir === 'ASC' ? ' ↑' : ' ↓';
  };

  if (error) return <div className="error-message p-8">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-header-title">Employees</h2>
        <button onClick={handleOpenAdd} className="btn-primary">
          Add Employee
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isFormOpen && (
        <div className="dashboard-form-container">
          <h3 className="dashboard-form-title">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
          <form onSubmit={handleSubmit} className="dashboard-form">
            <input className="form-input" placeholder="First Name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            <input className="form-input" placeholder="Last Name" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            <input className="form-input" placeholder="Email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input className="form-input" placeholder="Salary" type="number" required value={formData.salary} onChange={e => setFormData({...formData, salary: Number(e.target.value)})} />
            <input className="form-input" placeholder="Hire Date" type="date" required value={formData.hireDate} onChange={e => setFormData({...formData, hireDate: e.target.value})} />
            <select className="form-select" value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}>
              <option value="">No Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <div className="form-actions">
              <button type="submit" className="btn-success">Save</button>
              <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table-container">
        {loading && (
          <div className="overlay-loading">
            <div className="spinner spinner-sm"></div>
          </div>
        )}
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable-header" onClick={() => handleSort('firstName')}>Name{renderSortIcon('firstName')}</th>
              <th className="sortable-header" onClick={() => handleSort('email')}>Email{renderSortIcon('email')}</th>
              <th className="sortable-header" onClick={() => handleSort('hireDate')}>Hire Date{renderSortIcon('hireDate')}</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="data-table-row">
                <td className="data-table-cell">{emp.firstName} {emp.lastName}</td>
                <td className="data-table-cell">{emp.email}</td>
                <td className="data-table-cell">{emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : 'N/A'}</td>
                <td className="data-table-cell">{emp.departmentName || 'N/A'}</td>
                <td className="data-table-cell">
                  <div className="action-buttons">
                    <button onClick={() => handleOpenEdit(emp)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(emp.id)} className="btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="pagination-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span className="pagination-info">Page {page} of {Math.ceil(total / limit) || 1}</span>
        <button className="pagination-btn" disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
