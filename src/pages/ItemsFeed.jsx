import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; // NEW: Import your auth context!

const ItemsFeed = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: Grab the currently logged-in user
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/lost-items'); 
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleMarkFound = async (itemId) => {
    try {
      await api.delete(`/lost-items/${itemId}`);
      setItems((prevItems) => prevItems.filter((item) => (item.id || item._id) !== itemId));
      toast.success('Item marked as found!');
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error(error.response?.data?.message || 'Failed to update item.');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading items...</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Campus Lost & Found</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">No items reported yet.</p>
        ) : (
          items.map((item) => {
            const itemId = item.id || item._id;
            
            // NEW: Security Check Logic
            // Note: Adjust 'item.reporterId' to 'item.userId' depending on what you named it in your Prisma schema!
            const isCreator = user && (user.id === item.reporterId || user.id === item.userId);
            const isAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'CLUB_ADMIN');
            const canModify = isCreator || isAdmin;

            return (
              <div key={itemId} className="bg-white p-4 rounded shadow-md border flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-48 object-cover rounded mb-4 border border-gray-100"
                    />
                  )}
                  
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-3">
                    Status: {item.status}
                  </p>
                  
                  {/* NEW: We only render the button if canModify is TRUE */}
                  {canModify && (
                    <button 
                      onClick={() => handleMarkFound(itemId)}
                      className="w-full bg-green-500 text-white font-medium py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      ✓ Mark as Found
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ItemsFeed;