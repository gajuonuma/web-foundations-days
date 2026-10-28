
# Day 7: Scaling a Photo-Sharing App

## 1. Assumptions

The app has 10 million registered users, but not everyone uses it daily. Assuming 10% of the users are active each day, we have 1 million daily active users.

Each active user uploads one photo and views 50 feed pages per day. An average original photo is 2 MB, while its thumbnail is 50 KB.

For the request-rate calculations, I will use 100,000 seconds per day, following the simplified approach. This is an approximation for the exercise; an actual day has 86,400 seconds.

For the yearly storage estimate, I assume the app runs every day for 365 days and keeps both the original photos and their thumbnails.

## 2. Basic calculations

### Daily active users

10,000,000 × 10% = 1,000,000 users

This means about one million people use the app each day.

### Photo uploads per second

Each active user uploads one photo per day.

Uploads per day = 1,000,000 × 1 = 1,000,000

Using 100,000 seconds per day:

Uploads per second = 1,000,000 ÷ 100,000 = **10 uploads per second**

### Feed views per second

Each active user views 50 feed pages daily.

Feed views per day = 1,000,000 × 50 = 50,000,000

Average feed views per second = 50,000,000 ÷ 100,000 = **500 views per second**

If traffic rises to five times the average during busy periods:

Peak feed views per second = 500 × 5 = **2,500 views per second**

The app therefore needs to handle around 500 feed views per second on average and approximately 2,500 during peak periods. These figures are estimates, since actual traffic will not be evenly distributed throughout the day.

### Storage needed per year

Each day, one million original photos are uploaded.

**Original photo storage per day:**

1,000,000 × 2 MB = 2,000,000 MB = 2 TB

**Original photo storage per year:**

2 TB × 365 = **730 TB**

**Thumbnail storage per day:**

1,000,000 × 50 KB = 50,000,000 KB = 50 GB

**Thumbnail storage per year:**

50 GB × 365 = **18.25 TB**

Total additional storage required each year:

730 TB + 18.25 TB = **748.25 TB per year**

These are decimal storage estimates. They do not include database records, backups, replicas, or other overhead. The estimate also assumes one thumbnail per uploaded photo.

## 3. Is the app read-heavy or write-heavy?

The app is read-heavy. It receives one million photo uploads per day but serves 50 million feed-page views per day. That is 50 feed views for every upload.

This means the system needs to serve existing content quickly while continuing to accept new photos. Caching frequently requested feed data and thumbnails can reduce the amount of work the application servers and database need to do.

## 4. Where should the photos be stored?

I would store the original photos and thumbnails in object storage, rather than saving the image files directly inside the main database.

Object storage is designed to hold large numbers of files. The database can instead store information about each photo, such as its owner, upload time, storage key, caption, and thumbnail location.

This separation keeps the database focused on records and queries, while the object storage service handles the image files. A content delivery network (CDN) can then deliver frequently requested images from locations closer to users.

## 5. Proposed architecture

```text
                 Mobile App / Browser
                          |
                         DNS
                          |
                         CDN
                  (cached images)
                          |
                    Load Balancer
                          |
              +-----------+-----------+
              |           |           |
           App Server  App Server  App Server
              |           |           |
              +-----------+-----------+
                          |
                  +-------+-------+
                  |               |
                Cache          Primary DB
                  |               |
                  |          Read Replica
                  |
             Feed data and
            frequently used data

Mobile App / Browser
          |
          | Upload photo
          v
     Object Storage
          |
          | Upload event
          v
        Queue
          |
          v
     Background Worker
          |
          | Create thumbnail
          v
     Object Storage
          |
          | Save photo details and status
          v
       Primary DB
```

The diagram shows the main components and their responsibilities. In a production system, the application would coordinate the upload and processing steps, and access to the storage and database would be controlled by the backend.

## 6. What each component does

- **Mobile app or browser:** Allows users to upload photos and browse their feeds.
- **DNS:** Directs the app's domain name to the appropriate service.
- **CDN:** Caches and delivers images closer to users, reducing repeated requests to the origin storage.
- **Load balancer:** Distributes incoming application requests across available app servers.
- **Application servers:** Handle authentication, feed requests, photo metadata, and other application logic.
- **Cache:** Keeps frequently requested feed data or metadata in fast memory so the application does not need to query the database every time.
- **Primary database:** Stores photo records, user information, captions, and other structured data, and handles writes.
- **Read replica:** Serves suitable read queries to reduce pressure on the primary database, although replication delays must be considered.
- **Object storage:** Holds the original photos and generated thumbnails.
- **Queue:** Holds background jobs so that photo processing does not have to finish before the upload request can return.
- **Background worker:** Picks up queued jobs, creates thumbnails, stores them, and updates the photo's processing status.

## 7. What happens when a user uploads a photo?

1. The user selects a photo in the mobile app or browser and starts the upload.
2. The backend checks the user's authentication and validates the request, including the file type and size.
3. The backend creates a photo record in the primary database, initially marking the photo as pending.
4. The backend provides a short-lived upload URL or another controlled method for sending the file to object storage.
5. The client uploads the original photo to object storage.
6. The backend or storage event handler confirms that the upload completed and adds a thumbnail-generation job to the queue.
7. A background worker takes the job, reads the original photo, creates a smaller thumbnail, and saves it to object storage.
8. The worker updates the database with the thumbnail location and marks processing as complete.
9. When the photo appears in a feed, the app retrieves its metadata and uses the appropriate image URL. The CDN can serve cached image copies to reduce latency.

If thumbnail generation fails, the job should be retried safely, with a limit on repeated attempts and a way to investigate jobs that continue to fail. The app should also avoid showing a photo as fully ready before the required processing has completed.

## 8. Trade-offs to consider

### Caching versus fresh data

Caching makes feed requests faster and reduces database load. However, cached information can become outdated after a user uploads or deletes a photo. The application needs a way to expire or update affected cache entries.

### Read replicas versus consistency

A read replica helps distribute the large number of read requests. However, updates may take time to appear on the replica. If a user uploads a photo and immediately opens their feed, the app may need to read from the primary database or otherwise handle that delay.

### Background processing versus immediate availability

Using a queue and workers keeps uploads responsive because thumbnail generation happens separately. The downside is that thumbnails may not be ready immediately. The application must handle pending jobs, retries, and failures without losing track of uploaded photos.

### Object storage and CDN versus operational complexity

Object storage and a CDN are suitable for a large collection of photos and can reduce the load on application servers. However, they introduce extra configuration, access-control requirements, caching rules, and costs that need to be monitored.

## 9. Conclusion

The estimates suggest that the app needs to support about 10 photo uploads per second, 500 feed views per second on average, and around 2,500 feed views per second at peak under the classroom calculation method. It also needs roughly 748.25 TB of additional storage per year for original photos and one thumbnail per photo.

Since feed views greatly outnumber uploads, I would prioritise efficient reads through caching, a CDN, and read replicas. I would keep photo files in object storage and use a queue with background workers to generate thumbnails. This design separates the main responsibilities and gives the app room to scale as the number of users and photos grows.