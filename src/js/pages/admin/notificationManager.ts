export class NotificationManager {
  private container: HTMLDivElement;

  constructor() {
    this.container = this.createContainer();
  }

  private createContainer(): HTMLDivElement {
    let container = document.getElementById(
      'notification-container'
    ) as HTMLDivElement;

    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
      `;
      document.body.appendChild(container);
    }

    return container;
  }

  show(type: 'success' | 'error', message: string): void {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      padding: 10px 20px;
      margin-bottom: 10px;
      border-radius: 4px;
      color: white;
      background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
    `;

    this.container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}
