import { createRoot } from 'react-dom/client'
import App from './App'

import { ThemeProvider } from '@material-tailwind/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)
const clientId = '1035301918517-t8i82kopsbjfuu06urbauqcv9qnacq5o.apps.googleusercontent.com'

root.render(
	<GoogleOAuthProvider clientId={clientId}>
		<SnackbarProvider
			maxSnack={3}
			autoHideDuration={2000}
			style={{ fontFamily: 'inter' }}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			classes={{
				containerRoot: 'z-[10000000000]',
			}}
		>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</SnackbarProvider>
	</GoogleOAuthProvider>
)
