import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
    employees: any[] = [];

  constructor(private _employeeService: EmployeeService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getEmployees()
  }

  getEmployees() {
    this._employeeService.getEmployees().subscribe(data => {
      this.employees = [];
    data.forEach((element: any) => {
      this.employees.push({
        id: element.payload.doc.id,
        ...element.payload.doc.data()
      })
    });
    console.log(this.employees);
    });
  }
  deleteEmployee(id: string) {
    this._employeeService.deleteEmployee(id).then(() => {
      console.log('Employee deleted successfully')
      this.toastr.error('The employee has been deleted successfully', 'All done!', {
        positionClass: 'toast-bottom-right'
      });
    }).catch(error => {
      console.log(error);
    })
  }
}
