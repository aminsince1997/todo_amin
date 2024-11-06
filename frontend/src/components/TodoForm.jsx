import React, { useState, useEffect } from 'react';
import '../css/TodoForm.css';
 const TodoForm = ({ onSubmit, currentTodo, setCurrentTodo }) => {
   const [formData, setFormData] = useState({
     title: '',
     description: '',
     priority: '1',
     due_date: ''
   });
   
   const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
     if (currentTodo) {
       setFormData({
         title: currentTodo.title,
         description: currentTodo.description || '',
         priority: currentTodo.priority || '1',
         due_date: currentTodo.due_date ? new Date(currentTodo.due_date).toISOString().substring(0,10) : ''
       });
     }
   }, [currentTodo]);

   const handleSubmit = (e) => {
     e.preventDefault();
     
     const submittedData = {
       ...formData,
       due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
       creation_date: new Date().toISOString() 
     };
     
     onSubmit(submittedData);
     
     setFormData({ title: '', description: '', priority:'1', due_date:'' });
   };

   return (
     <>
       <button className="creation-box" onClick={() => setIsVisible(!isVisible)}>
         {isVisible ? 'Hide' : 'Add a Todo'}
       </button>

       {isVisible && (
         <form onSubmit={handleSubmit} className="todo-form creation-box">
           <input
             type="text"
             value={formData.title}
             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
             placeholder="Title"
             required
           />
           
           <textarea
             value={formData.description}
             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
             placeholder="Description"
           />

           <select 
             value={formData.priority} 
             onChange={(e) => setFormData({ ...formData, priority:e.target.value })}
           >
             {[1,2,3,4,5].map((priority) => (
               <option key={priority} value={priority}>
                 Priority {priority}
               </option>
             ))}
           </select>

           <input 
             type="date" 
             value={formData.due_date} 
             onChange={(e) => setFormData({ ...formData,due_date:e.target.value })} 
           />

           <button type="submit" className="creation-box">{currentTodo ? 'Update' : 'Add'} Todo</button>

           {currentTodo && (
             <button type="button" onClick={() => setCurrentTodo(null)}>
               Cancel
             </button>
           )}
         </form>
       )}
     </>
   );
};

export default TodoForm;