import nodemailer from 'nodemailer'

export const sendEmail = async({ to, subject, html }) =>{
    try{

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            from: `"Skill up" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        }


        await transporter.sendMail(mailOptions)
        console.log(`📧 Email sent to ${to}`)
    }
    catch(err){
        res.status(500).json({
            message: "Email not sent"
        })
    }
}