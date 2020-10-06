import Link from 'next/link'
import { useRouter } from 'next/router'

const LinkComponent = ({ href, children, onClick }) => {
  const router = useRouter()
  const selected = router.pathname === href
  const prevent = (e) => {
    selected && e.preventDefault()
    onClick && onClick()
  }

  let className = children.props.className || ''
  if (selected) {
    className = `${className} selected`
  }

  return <Link href={href}>{React.cloneElement(children, { className, selected, onClick: prevent })}</Link>
};

export default LinkComponent;
