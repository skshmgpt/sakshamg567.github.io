export default function Social({ Icon, Text, Link }) {
   return (
      <a href={Link} target="_blank" rel="noopener noreferrer">
         <span className='items-center flex flex-row hover:text-white gap-1.5 transition-all duration-100 justify-center text-center'>
            <Icon fontSize='small' />
            <span className='mt-0.5'>{Text}</span>
         </span>
      </a>
   )
} 
