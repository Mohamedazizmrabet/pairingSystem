"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios  from "axios";
import {showErrorToast,showSuccessToast}from "../../ultils/toast"
interface Student {
  firstName: string;
  middleName: string;
  lastName: string;
}

const StudentForm: React.FC = () => {
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const [numberOfStudents, setNumberOfStudents] = useState<number>(1);

  // Initialize the studentNames state using the useState initializer function
  const [studentNames, setStudentNames] = useState<Student[]>(() => {
    return Array(numberOfStudents).fill({
      firstName: "",
      middleName: "",
      lastName: "",
    });
  });
  console.log(studentNames);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target);

    const { name, value } = event.target;
    const updatedStudentNames = [...studentNames];
    updatedStudentNames[index][name as keyof Student] = value;
    console.log(updatedStudentNames);

    setStudentNames(updatedStudentNames);
    
  };

  const handleNumberOfStudentsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    setNumberOfStudents(value);

    // Update studentNames using the functional form of setStudentNames
    setStudentNames((prevStudentNames) => {
      const newStudentNames = [...prevStudentNames];
      while (newStudentNames.length < value) {
        newStudentNames.push({ firstName: "", middleName: "", lastName: "" });
      }
      console.log(newStudentNames);

      return newStudentNames.slice(0, value);
    });
  };
  const handleSubmit =  (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
       axios.post("http://localhost:3000/student/add", {students:studentNames}).then((response)=>{
        console.log(response);
        
        if(!response){
          showErrorToast("error try again")
        }
        else{

          showSuccessToast("the students has been added successfully")
        }
       })
    } catch (error) {
     
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow-lg">
      <label className="block mb-2 font-bold text-lg">
        Number of Students: Dont delete the 0
      </label>
      <input
        type="number"
        className="w-full py-2 px-4 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-500"
        value={numberOfStudents}
        onChange={handleNumberOfStudentsChange}
      />
      {studentNames.map((student, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-2 font-bold text-lg">
            Student {index + 1}
          </label>
          <input
            type="text"
            placeholder="First Name *"
            className="w-full py-2 px-4 mb-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            name="firstName"
            value={student.firstName}
            onChange={(event) => handleInputChange(index, event)}
          />
          <input
            type="text"
            placeholder="Middle Name"
            className="w-full py-2 px-4 mb-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            name="middleName"
            value={student.middleName}
            onChange={(event) => handleInputChange(index, event)}
          />
          <input
            type="text"
            placeholder="Last Name *"
            className="w-full py-2 px-4 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-500"
            name="lastName"
            value={student.lastName}
            onChange={(event) => handleInputChange(index, event)}
          />

        </div>
      ))}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          onClick={(ev)=>{handleSubmit(ev)}}
        >
          Submit
        </button>
    </div>
  );
};

export default StudentForm;
