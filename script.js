

var app = new Vue({
    el: '#app',
    data: {
        recherche: "",
        rechercheGifts: "",
        bdsList: [],
        myBds : true,
        myFriends: false,
        new_bd : false,
        new_gift: false,
        new_name: "",
        new_date: "",
        new_photo: "lapin.jpg",
        newGiftName:"",
        newGiftDate: "",
        friendOpen:"",
        friend: {},
        filteredNamesList:"",
        filteredGiftsList:"",
    },
    mounted(){
        if (localStorage.bdsList){
            this.bdsList = JSON.parse(localStorage.bdsList);
        }
        this.dayBeforeBd()
        this.sortBds()
    },
    computed: {
        filteredNames() {
            if(this.recherche){
                this.filteredNamesList =  this.bdsList.filter((item)=>{
                    return item.name.includes(this.recherche);
                  })
                return this.filteredNamesList
            }else{
                return this.bdsList;
            }
        },

        filteredGifts() {
            if(this.rechercheGifts){
                return this.friend.gifts.filter((item)=>{
                    return item[1].includes(this.rechercheGifts);
                  })
            }else{
                return this.friend.gifts;
            }
        }
    },
    methods: {
        save: function(){
            localStorage.bdsList = JSON.stringify(this.bdsList);
            console.log("sauvegarde done")
        },

        addBd: function () {
            if(this.new_name!=null && this.new_date!=null){
                this.bdsList.push({"name": this.new_name, "gifts":[], "photo": this.new_photo, "dateY": this.new_date, "date":this.new_date.slice(5), "dateFormated":this.new_date.slice(8)+"-"+ this.new_date.slice(5,7)+"-"+this.new_date.slice(0,4)})
                this.new_bd=false
                this.dayBeforeBd()
                this.sortBds()

                this.new_name = ""
                this.new_date = ""
                this.newPhoto = ""
            }
        },

        sortBds: function (){
            var byDate = this.bdsList.slice(0);
            byDate.sort(function(a,b) {
                return (a.dayBeforeBd - b.dayBeforeBd);
            });
            this.bdsList=byDate
            this.save()
        },

        dayBeforeBd: function(){
            thisYear = new Date().getFullYear()
            for(bd of this.bdsList){
                dayDiff = Math.floor(((new Date(thisYear + "-"+bd.date)).getTime() - (new Date()).getTime()) /(1000*60*60*24))+1
                if(dayDiff<0){
                    dayDiff = 364+dayDiff
                }
                bd.dayBeforeBd = dayDiff
            }
        },

        removeBd: function(index){
            this.bdsList.splice(index, 1)
            this.save()
        },

        addGift: function(){
            index=this.friendOpen;
            console.log(this.bdsList[index])

            if(!("gifts" in this.bdsList[index])){
                this.bdsList[index].gifts = [[ this.newGiftDate, this.newGiftName]]
                this.bdsList.save+=1;
            }else{
                this.bdsList[index].gifts.push([ this.newGiftDate, this.newGiftName]);
                this.bdsList.save+=1;
                // this.bdsList[index].gifts.date = this.newGiftName
            }
            this.save()
            this.genereFriend(index)
            this.newGiftDate = ""
            this.newGiftName = ""
            console.log(this.bdsList[index])
        },
        genereFriend: function(index){
            console.log("generefriend", this.filteredNamesList)
            if(this.filteredNamesList){
                newIndex = this.getRealIndex(this.bdsList, this.filteredNamesList, index)
            }else{
                newIndex = index
            }
            console.log("nouvel index", newIndex)
            this.friend = this.bdsList[newIndex];
            this.friendOpen = newIndex;
        },

        getRealIndex: function(bigTable, smallTable, index){
            for(let i = 0; i<bigTable.length; i++){
                if( bigTable[i].name == smallTable[index].name){
                    return i
                }
            }
            console.log("erreur dans la retrouvail de l'id !")
        },
        removeGift: function(indexGift){
            this.bdsList[this.friendOpen].gifts.splice(indexGift, 1)
            this.save()
        },
        newPhoto: function(event){
            console.log(event)
            console.log(event.target.files[0])
            this.getBase64(event.target.files[0])
            // this.newPhoto= event.target.files
        },
        getBase64: function(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                app.new_photo = reader.result;
            };
            reader.onerror = function (error) {
              console.log('Error: ', error);
            };
         }
      },
})

