import { EmployeeService } from './../../services/employee.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  createEmployee: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  title = 'Add employee';

  constructor(private fb: FormBuilder, 
    private _employeeService: EmployeeService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) { 
    this.createEmployee = this.fb.group({
      forename: ['', Validators.required],
      surname: ['', Validators.required],
      document: ['', Validators.required],
      salary: ['', Validators.required]
    })

    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.isEdited();
  }

  addEditEmployee() {
    this.submitted = true;

    if(this.createEmployee.invalid){
      return;
    }

    if(this.id === null) {
      this.addEmployee();
    }else{
      this.editEmployee(this.id);
    }
  }

  addEmployee() {
    const employee: any = {
      forename: this.createEmployee.value.forename,
      surname: this.createEmployee.value.surname,
      document: this.createEmployee.value.document,
      salary: this.createEmployee.value.salary,
      dateCreation: new Date(),
      dateUpdate: new Date()
    }
    this.loading = true;
    this._employeeService.addEmployee(employee).then(()=> {
      this.toastr.success('The employee has been registered.', 'All done!', {
        positionClass: 'toast-bottom-right'
      });
      this.loading = false;
      this.router.navigate(['/list-employees']);
    }).catch(error => {
      console.log(error);
      this.loading = false;
    })
  }
  

  editEmployee(id: string) {

    const employee: any = {
      forename: this.createEmployee.value.forename,
      surname: this.createEmployee.value.surname,
      document: this.createEmployee.value.document,
      salary: this.createEmployee.value.salary,
      dateUpdate: new Date()
    }

    this.loading = true;

    this._employeeService.updateEmployee(id, employee).then(()=> {
      this.loading = false;
      this.toastr.info('The employee has been edited successfully', 'All done!', {
      positionClass: 'toast-bottom-right'
    })
    this.router.navigate(['/list-employees']);
    })
  }

  isEdited() {
    this.title = 'Add/Edit Employee'
    if(this.id !== null) {
      this.loading = true;
      this._employeeService.getEmployee(this.id).subscribe(data => {
        this.loading = false;
        this.createEmployee.setValue( {
          forename: data.payload.data()['forename'],
          surname: data.payload.data()['surname'],
          document: data.payload.data()['document'],
          salary: data.payload.data()['salary'],
        })
      })
    }
  }
}