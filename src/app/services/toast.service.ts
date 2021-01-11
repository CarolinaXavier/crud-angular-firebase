import { Injectable } from '@angular/core';
import { ToastOptions, ToastsManager } from 'ng2-toastr';

@Injectable()
export class ToastMessageService {
	private toast: any;
	private loading: any;
	constructor(public toastManager: ToastsManager) {
	}

	showSuccessToast(title: string = 'Sucesso', msg: string = 'Concluído') {
		this.toastManager.success(msg, title, { toastLife: 3000, showCloseButton: true, animate: 'flyLeft' });
	}

	showWarningToast(title: string = 'Atenção', msg: string = 'Cuidado') {
		this.toastManager.warning(msg, title, { toastLife: 3000, showCloseButton: true, animate: 'flyLeft' });
	}

	showErrorToast(title: string = 'Erro', msg: string = 'Erro') {
		this.toastManager.error(msg, title, { toastLife: 3000, showCloseButton: true, animate: 'flyLeft' });
	}

	showLoadingToast(msg: string = 'Carregando...') {
		return this.toastManager.custom('<div class="loader"></div>', msg, { toastLife: 3600000, enableHTML: true, showCloseButton: true, animate: 'flyLeft' }).then(toast => {
			this.loading = toast;
			return toast;
		});
	}

	clearLoadingToast() {
		setTimeout(() => {
			if (this.loading) {
				this.toastManager.clearToast(this.loading);
				this.loading = null;
			}
		}, 110);
	}

	clearToasts() {
		this.toastManager.clearAllToasts();
	}

	setRoot(vcr: any) {
		this.toastManager.setRootViewContainerRef(vcr);
	}

}
