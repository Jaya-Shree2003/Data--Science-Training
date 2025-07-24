use job_portaldb


db.jobs.insertMany([
  { job_id: 11, job_title: "Full Stack Developer", company: "TechZen", location: "Mumbai", salary: 1100000, job_type: "remote", posted_on: new Date("2025-07-02") },
  { job_id: 12, job_title: "Machine Learning Engineer", company: "DataDrill", location: "Chennai", salary: 1350000, job_type: "on-site", posted_on: new Date("2025-07-09") },
  { job_id: 13, job_title: "System Administrator", company: "NetSecure", location: "Noida", salary: 950000, job_type: "hybrid", posted_on: new Date("2025-07-06") },
  { job_id: 14, job_title: "React Developer", company: "Appify", location: "Bangalore", salary: 1050000, job_type: "remote", posted_on: new Date("2025-07-14") },
  { job_id: 15, job_title: "Product Designer", company: "DesignMind", location: "Ahmedabad", salary: 920000, job_type: "on-site", posted_on: new Date("2025-07-07") },
  { job_id: 16, job_title: "Automation Tester", company: "TestMate", location: "Kochi", salary: 850000, job_type: "on-site", posted_on: new Date("2025-07-19") }
])


db.applicants.insertMany([
  { applicant_id: 111, name: "Aarav Nair", skills: ["React", "Node.js", "MongoDB"], experience: 2, city: "Mumbai", applied_on: new Date("2025-07-17") },
  { applicant_id: 112, name: "Divya Shah", skills: ["Python", "Scikit-learn", "SQL"], experience: 3, city: "Chennai", applied_on: new Date("2025-07-18") },
  { applicant_id: 113, name: "Manish Kumar", skills: ["Linux", "Bash", "AWS"], experience: 4, city: "Noida", applied_on: new Date("2025-07-13") },
  { applicant_id: 114, name: "Sara Menon", skills: ["Figma", "UI Design", "HTML"], experience: 1, city: "Bangalore", applied_on: new Date("2025-07-20") },
  { applicant_id: 115, name: "Nikhil Raj", skills: ["Java", "Spring Boot", "REST API"], experience: 5, city: "Ahmedabad", applied_on: new Date("2025-07-16") },
  { applicant_id: 116, name: "Ishita Das", skills: ["Selenium", "TestNG", "Java"], experience: 2, city: "Kolkata", applied_on: new Date("2025-07-21") }
])



db.applications.insertMany([
  { application_id: 211, applicant_id: 111, job_id: 11, application_status: "interview scheduled", interview_scheduled: new Date("2025-07-24"), feedback: "Good full stack understanding" },
  { application_id: 212, applicant_id: 112, job_id: 12, application_status: "applied", interview_scheduled: null, feedback: null },
  { application_id: 213, applicant_id: 113, job_id: 13, application_status: "rejected", interview_scheduled: null, feedback: "Weak network fundamentals" },
  { application_id: 214, applicant_id: 114, job_id: 15, application_status: "interview scheduled", interview_scheduled: new Date("2025-07-26"), feedback: "Excellent design portfolio" },
  { application_id: 215, applicant_id: 115, job_id: 11, application_status: "applied", interview_scheduled: null, feedback: null },
  { application_id: 216, applicant_id: 115, job_id: 14, application_status: "applied", interview_scheduled: null, feedback: null }
])



// 1. Find all remote jobs with a salary greater than 10,00,000.

db.jobs.find({ job_type: "remote", salary: { $gt: 1000000 } })


// 2. Get all applicants who know MongoDB.

db.applicants.find({ skills: "MongoDB" })


// 3. Show the number of jobs posted in the last 30 days.

db.jobs.aggregate([
  { $match: { posted_on: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
  { $count: "jobs_last_30_days" }
])


// 4. List all job applications that are in ‘interview scheduled’ status.

db.applications.find({ application_status: "interview scheduled" })


// 5. Find companies that have posted more than 2 jobs.

db.jobs.aggregate([
  { $group: { _id: "$company", job_count: { $sum: 1 } } },
  { $match: { job_count: { $gt: 2 } } }
])


// 6. Join applications with jobs to show job title along with the applicant’s 
name.

db.applications.aggregate([
  { $lookup: {
      from: "jobs",
      localField: "job_id",
      foreignField: "job_id",
      as: "job_info"
  }},
  { $lookup: {
      from: "applicants",
      localField: "applicant_id",
      foreignField: "applicant_id",
      as: "applicant_info"
  }},
  { $unwind: "$job_info" },
  { $unwind: "$applicant_info" },
  { $project: {
      job_title: "$job_info.job_title",
      applicant_name: "$applicant_info.name"
  }}
])


// 7. Find how many applications each job has received.

db.applications.aggregate([
  { $group: {
      _id: "$job_id",
      application_count: { $sum: 1 }
  }}
])


// 8. List applicants who have applied for more than one job.

db.applications.aggregate([
  { $group: {
      _id: "$applicant_id",
      total_applications: { $sum: 1 }
  }},
  { $match: { total_applications: { $gt: 1 } }},
  { $lookup: {
      from: "applicants",
      localField: "_id",
      foreignField: "applicant_id",
      as: "applicant_info"
  }},
  { $unwind: "$applicant_info" },
  { $project: {
      applicant_name: "$applicant_info.name",
      total_applications: 1
  }}
])


// 9. Show the top 3 cities with the most applicants.

db.applicants.aggregate([
  { $group: {
      _id: "$city",
      applicant_count: { $sum: 1 }
  }},
  { $sort: { applicant_count: -1 } },
  { $limit: 3 }
])

// 10. Get the average salary for each job type (remote, hybrid, on-site).

db.jobs.aggregate([
  { $group: {
      _id: "$job_type",
      avg_salary: { $avg: "$salary" }
  }}
])


// 11. Update the status of one application to "offer made".

db.applications.updateOne(
  { application_status: "interview scheduled" },
  { $set: { application_status: "offer made" } }
)


// 12. Delete a job that has not received any applications.

db.jobs.aggregate([
  { $lookup: {
      from: "applications",
      localField: "job_id",
      foreignField: "job_id",
      as: "apps"
  }},
  { $match: { apps: { $eq: [] } } }
])




// 13. Add a new field shortlisted to all applications and set it to false.

db.applications.updateMany({}, { $set: { shortlisted: false } })


// 14. Increment experience of all applicants from "Hyderabad" by 1 year.

db.applicants.updateMany(
  { city: "Hyderabad" },
  { $inc: { experience: 1 } }
)


// 15. Delete all applicants who haven’t applied to any job.

ddb.applicants.aggregate([
  {
    $lookup: {
      from: "applications",
      localField: "applicant_id",
      foreignField: "applicant_id",
      as: "apps"
    }
  },
  {
    $match: {
      apps: { $size: 0 }
    }
  }
])


