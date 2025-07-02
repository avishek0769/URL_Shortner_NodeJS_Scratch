import mongoose, {Schema} from "mongoose"

const urlSchema = new Schema({
    redirectUrl: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    historyClicked: [{
        timestamp: {
            type: Number,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        device: {
            type: String,
            required: true,
        }
    }]
})

export const Url = mongoose.model("Url", urlSchema)