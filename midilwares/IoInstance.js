export let IoInstance;
export const setIo=(io)=>{
  if(!IoInstance){
  IoInstance=io;
  }
}
export const getIo=()=>{
  return IoInstance
}
