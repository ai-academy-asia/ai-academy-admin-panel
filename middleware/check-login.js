export default ({ redirect, query, req, route, params }) => {
  const host = req.headers.host
  const allowedDomains = ['localhost:3060', 'eshop.pearls.mn']
  if (allowedDomains.includes(host) && route.name === 'login') {
    return redirect({ name: 'shop-login', query, params })
  } else if (!allowedDomains.includes(host) && route.name === 'shop-login') {
    return redirect({ name: 'login', query, params })
  }
}
