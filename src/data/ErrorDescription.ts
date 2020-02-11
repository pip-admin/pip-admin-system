export class ErrorDescription {
	public type: string;
	public category: string;
	public status: number;
	public code: string;
	public message: string;
	public details: any;
	public correlation_id: string;
	public cause: string;
	public stack_trace: string;
}