export function conversationAsLinks (state) {
  let ret = [];
  for(let conv of state.conversations) {
    ret.push({
      id: conv.id,
      title: conv.name,
      icon: 'chat'
    });
  }
  return ret
}
