import React, { useState, useEffect } from 'react';
import './InventoryManager.css';


const API_URL = `/api/items`; // 'http://host.docker.internal:5000/api/items';

const InventoryManager = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        kategori: '',
        quantity: '',
        harga: '',
        description: ''
    });
    const [editId, setEditId] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Gagal mengambil data');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
            setAlert({ message: 'Gagal memuat data barang', type: 'danger' });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const itemData = {
            ...formData,
            quantity: parseInt(formData.quantity),
            harga: parseInt(formData.harga)
        };

        try {
            let response;
            if (editId) {
                response = await fetch(`${API_URL}/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });
            } else {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });
            }

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Terjadi kesalahan');

            setAlert({
                message: editId ? 'Barang berhasil diupdate!' : 'Barang berhasil ditambahkan!',
                type: 'success'
            });
            resetForm();
            fetchItems(); // Refresh data
        } catch (error) {
            console.error('Error submitting item:', error);
            setAlert({ message: `Gagal menyimpan barang: ${error.message}`, type: 'danger' });
        }
    };

    const handleEdit = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error('Gagal mengambil data');
            const item = await response.json();
            setFormData({
                name: item.name,
                kategori: item.kategori,
                quantity: item.quantity,
                harga: item.harga,
                description: item.description || ''
            });
            setEditId(id);
        } catch (error) {
            console.error('Error fetching item for edit:', error);
            setAlert({ message: `Gagal memuat data barang: ${error.message}`, type: 'danger' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Gagal menghapus');

            setAlert({ message: 'Barang berhasil dihapus!', type: 'success' });
            fetchItems(); // Refresh data
        } catch (error) {
            console.error('Error deleting item:', error);
            setAlert({ message: `Gagal menghapus barang: ${error.message}`, type: 'danger' });
        }
    };

    const resetForm = () => {
        setFormData({ name: '', kategori: '', quantity: '', harga: '', description: '' });
        setEditId(null);
    };

    const filteredItems = items.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchCategory = !categoryFilter || item.kategori === categoryFilter;
        return matchSearch && matchCategory;
    });

    return (
        <div className="inventory-container">
            {alert.message && (
                <div className={`alert alert-${alert.type}`}>
                    {alert.message}
                </div>
            )}

            <div className="card">
                <h2>Tambah/Edit Barang</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">name Barang</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="kategori">Kategori</label>
                        <select
                            id="kategori"
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Pilih Kategori --</option>
                            <option value="Elektronik">Elektronik</option>
                            <option value="Makanan">Makanan</option>
                            <option value="Pakaian">Pakaian</option>
                            <option value="Alat Tulis">Alat Tulis</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Jumlah quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="harga">Harga (Rp)</label>
                        <input
                            type="number"
                            id="harga"
                            name="harga"
                            value={formData.harga}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">description</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {editId ? 'Update Barang' : 'Tambah Barang'}
                    </button>
                    {editId && (
                        <button type="button" className="btn btn-danger" onClick={resetForm}>
                            Batal
                        </button>
                    )}
                </form>
            </div>

            <div className="card">
                <h2>Daftar Barang</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Cari barang..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">Semua Kategori</option>
                        <option value="Elektronik">Elektronik</option>
                        <option value="Makanan">Makanan</option>
                        <option value="Pakaian">Pakaian</option>
                        <option value="Alat Tulis">Alat Tulis</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
                <table id="itemsTable">
                    <thead>
                        <tr>
                            <th>name Barang</th>
                            <th>Kategori</th>
                            <th>quantity</th>
                            <th>Harga</th>
                            <th>description</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada data barang</td>
                            </tr>
                        ) : (
                            filteredItems.map(item => {
                                let stockClass = '';
                                if (item.quantity < 5) stockClass = 'stock-low';
                                else if (item.quantity < 20) stockClass = 'stock-medium';
                                else stockClass = 'stock-high';

                                return (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.kategori}</td>
                                        <td className={stockClass}>{item.quantity}</td>
                                        <td>Rp {parseInt(item.harga).toLocaleString('id-ID')}</td>
                                        <td>{item.description || '-'}</td>
                                        <td className="actions">
                                            <button className="btn btn-warning" onClick={() => handleEdit(item.id)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Hapus</button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryManager;
