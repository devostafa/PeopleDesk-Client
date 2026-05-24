import { useEffect, useState } from 'react';
import deptService from '../../../services/deptService';
import '../../../styles/components/deptDashboard.css';

export default function DeptDashboard() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('id:DESC');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '' });

  const limit = 5;

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await deptService.getAll(page, limit, search, sort);
      setDepartments(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [page, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) fetchDepartments();
      else setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await deptService.delete(id);
      fetchDepartments();
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
    setEditingDept(null);
    setFormData({ name: '' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dept: any) => {
    setEditingDept(dept);
    setFormData({ name: dept.name });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await deptService.update(editingDept.id, formData);
      } else {
        await deptService.create(formData);
      }
      setIsFormOpen(false);
      fetchDepartments();
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
        <h2 className="dashboard-header-title">Departments</h2>
        <button onClick={handleOpenAdd} className="btn-primary">
          Add Department
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isFormOpen && (
        <div className="dashboard-form-container">
          <h3 className="dashboard-form-title">{editingDept ? 'Edit Department' : 'Add New Department'}</h3>
          <form onSubmit={handleSubmit} className="dashboard-form">
            <input 
              placeholder="Department Name" 
              required 
              value={formData.name} 
              onChange={e => setFormData({ name: e.target.value })} 
              className="form-input"
            />
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
              <th className="sortable-header" onClick={() => handleSort('name')}>Name{renderSortIcon('name')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="data-table-row">
                <td className="data-table-cell">{dept.name}</td>
                <td className="data-table-cell">
                  <div className="action-buttons">
                    <button onClick={() => handleOpenEdit(dept)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(dept.id)} className="btn-delete">Delete</button>
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
