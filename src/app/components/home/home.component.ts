import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  studentName: string = '';
  parentName: string = '';
  contactNo: string = '';
  grade: string = '';
  percentage: string = '';
  school: string = '';
  address: string = '';  // Keep this if you added it

  // Controls popup visibility
  showAdmissionForm: boolean = false;
  showMoreReviews: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleReviews(): void {
    this.showMoreReviews = !this.showMoreReviews;
  }

  // ✅ THIS METHOD IS FOR THE LANDING PAGE NAVIGATION
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  apply(): void {

    const whatsappNumber = '8050354626';

    const message = `🎓 *Admission Enquiry*

👨‍🎓 Student Name: ${this.studentName}
👨 Parent Name: ${this.parentName}
📞 Contact Number: ${this.contactNo}
🏫 Grade Applying For: ${this.grade}
📊 Previous Year Percentage: ${this.percentage}%
🏫 Current School: ${this.school}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');

    // Close popup
    this.showAdmissionForm = false;

    // Reset form
    this.studentName = '';
    this.parentName = '';
    this.contactNo = '';
    this.grade = '';
    this.percentage = '';
    this.school = '';
  }

  closeForm(): void {
    this.showAdmissionForm = false;
  }

}