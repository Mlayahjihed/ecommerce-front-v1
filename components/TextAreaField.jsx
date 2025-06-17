const TextAreaField = (props) => {
    return (
      <div>
        <label className="block text-gray-700">{props.label}</label>
        <textarea
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          className="w-full p-2 border rounded-lg focus:border-teal-400 focus:bg-white focus:outline-none h-24"
        ></textarea>
      </div>
    );
  };
  
  export default TextAreaField;
  