

export class BaseRepository{

    constructor(model){
        this.model = model
    }

    createDocument(data){
        return this.model.create(data)
    }

    findOneDocument(filters , select = {}){
        return this.model.findOne(filters).select(select)
    }

    findDocumentById(id , select = {}){
        return this.model.findById(id).select(select)
    }

    findDocuments(filters , select = {}){
        return this.model.find(filters).select(select)
    }

    deleteOneDocument(id){
        return this.model.deleteOne(id)
    }
    updateWithFindById({id , data , options}){
        return this.model.findByIdAndUpdate(id , data ,options)
    }

    deleteManyDocuments({ filters , options={} }){
        const {session , ...otherOptions} = options
        const query = this.model.deleteMany(filters , otherOptions)
        if(session){
        return    query.session(session)
        }
        return query
    }
    deleteOneDocumentById({_id , options={} }){
        const {session , ...otherOptions} = options
        const query = this.model.findByIdAndDelete(_id , otherOptions)
        if(session){
         return   query.session(session)
        }
        return query
    }
}