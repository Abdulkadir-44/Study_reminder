function request(url,data=false,method="GET"){
    // console.log(url,data,method);
    return new Promise((resolve,reject)=>{
        //Eğer user varsa panel içindeyiz demektir yani yapacağımız isteklerin içine token ekleyeceğiz
        const parsedUser = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
        const options ={
            method,
            headers : {
                'Content-Type' : 'application/json',
            }
        }

        if(parsedUser){
            const token = parsedUser.token;
            options.headers.Authorization = `Bearer ${token}`;
        }

        if(data != null && (method == "POST" || method == "PUT" || method == "PATCH")){
            options.body = JSON.stringify(data);
        }
        // console.log(options);
        try {
            fetch(url,options)
              .then(async res=>{
                if(res.ok){
                    const data = await res.json();
                    resolve(data);
                }else{
                    const error = await res.json();
                    reject(error);
                }
              })
              .catch(err=>reject(err))
        } catch (error) {
            reject(error);
        }
    })
}


export const get = (url)=>request(url,false,"GET");
export const post = (url,data)=>request(url,data,"POST");
export const put = (url,data)=>request(url,data,"PUT");
export const patch = (url,data)=>request(url,data,"PATCH");
export const del = (url)=>request(url,false,"DELETE");
