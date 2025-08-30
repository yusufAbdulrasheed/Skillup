import multer from 'multer'

const storage =multer.diskStorage({})

const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "file/pdf",
    "video/mp4",
    "audio/mpeg",
    "audio/mp3",
    "video/mpeg",
    "video/mov"
] 

const fileFilter = (req, file, cb) => {
    if(allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    }else{
        cb( 
            new Error(
                "Invalid file type! Allowed types: JPEG, JPG, PNG, PDF, MP4, MP3, MOV"
            ),

            false
        )
    }
}

const upload = multer({storage, fileFilter})

export default upload