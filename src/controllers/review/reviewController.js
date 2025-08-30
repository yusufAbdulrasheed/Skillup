import Review from '../../models/reviewsModel.js'
import Course from '../../models/courseModel.js'

const addReview = async (req, res) =>{
    try{

        const { courseId } = req.params
        const { rating, comment } = req.body
        const studentId = req.user.id

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        const existingReview = await Review.findOne({ course: courseId, student: studentId})
        if(existingReview){
            return res.status(400).json({
                success: false,
                message: "You have already submitted a review for this course"
            })
        }

        if(!course.enrolledStudents || !course.enrolledStudents.includes(studentId)){
            return res.status(403).json({
                success: false,
                message: "You must be enrolled in the course to submit a review"
            })
        }

        const review = await Review.create({
            course: courseId,
            student: studentId,
            rating,
            comment
        })

        return res.status(201).json({ success: true, message: "Review Submitted Successfully", data: review})
    }
    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}


const editReview = async (req, res) =>{
    try{

        const { reviewId } = req.params
        const { rating, comment } = req.body
        const studentId = req.user.id

        const review = await Review.findById(reviewId)
        if(!review){
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        if(review.student.toString() !== studentId.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not allowed to edit this review"
            })
        }

        review.rating = rating || review.rating
        review.comment = comment || review.comment
        await review.save()

        return res.status(200).json({ success: true, message: "Review Updated Successfully", data: review})
    }
    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

const deleteReview = async (req, res) =>{
    try{

        const { reviewId } = req.params
        const studentId = req.user.id
        const userRole = req.user.role

        const review = await Review.findById(reviewId)
        if(!review){
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        if(review.student.toString() !== studentId.toString() && userRole !== 'admin'){
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this review"
            })
        }

        await review.deleteOne()
        return res.status(200).json({ success: true, message: "Review Deleted Successfully"})

    }
    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

const getCourseReviews = async (req, res) =>{
    try{

        const { courseId } = req.params

        const reviews = await Review.find({ course: courseId }).populate('student', 'name avatar').sort({ createdAt: -1 })
        return res.status(200).json({ success: true, count: reviews.length, data: reviews })
    }
    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }   
}

const getStudentReviews = async (req, res) =>{
    try{

        const { studentId } = req.user.id
        
        const reviews = await Review.find({ student: studentId }).populate('course', 'title thumbnail').sort({ createdAt: -1 })

        return res.status(200).json({ success: true, count: reviews.length, data: reviews })
    }
    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

const getAverageRating = async (req, res) =>{
    try{

        const { courseId } = req.params
        
        const stats = await Review.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) }},
            { $group: {
                _id: '$course',
                averageRating: { $avg: '$rating'},
                totalReviews: { $sum: 1}
            }}
        ])

        if(stats.length === 0){
            return res.status(200).json({
                success: true,
                averageRating: 0,
                totalReviews: 0
            })
        }

        return res.status(200).json({
            success: true,
            averageRating: stats[0].averageRating,
            totalReviews: stats[0].totalReviews
        })
    }
    catch(err){
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

export default {
    addReview,
    editReview,
    deleteReview,
    getCourseReviews,
    getStudentReviews,
    getAverageRating
}