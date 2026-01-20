import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLoanStore } from '../store/loanStore'
import './BankingComponents.css'
import {
    Upload,
    File as FileIcon,
    CheckCircle,
    XCircle,
    Shield,
    Loader2,
    Eye,
    Trash2
} from 'lucide-react'

interface UploadedFile {
    id: string
    file: globalThis.File
    type: 'id_front' | 'id_back' | 'payslip' | 'residence' | 'statement'
    status: 'uploading' | 'success' | 'error' | 'scanning'
    progress: number
    scanResult?: {
        virus: boolean
        tampered: boolean
        ocrConfidence: number
    }
}

export const DocumentUpload: React.FC = () => {
    const { updateDocuments } = useLoanStore()
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [scanning, setScanning] = useState(false)

    const simulateVirusScan = async (): Promise<UploadedFile['scanResult']> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    virus: Math.random() < 0.01,
                    tampered: Math.random() < 0.05,
                    ocrConfidence: Math.random() * 40 + 60 // 60-100%
                })
            }, 2000)
        })
    }

    // Helper functions moved above onDrop so they can be used immediately
    const determineFileType = (filename: string): UploadedFile['type'] => {
        const lower = filename.toLowerCase()
        if (lower.includes('id') || lower.includes('national')) {
            if (lower.includes('front')) return 'id_front'
            if (lower.includes('back')) return 'id_back'
            return 'id_front'
        }
        if (lower.includes('payslip') || lower.includes('salary')) return 'payslip'
        if (lower.includes('residence') || lower.includes('utility')) return 'residence'
        return 'statement'
    }

    const getFieldName = (type: UploadedFile['type']) => {
        switch (type) {
            case 'id_front': return 'idFront'
            case 'id_back': return 'idBack'
            case 'payslip': return 'payslip'
            default: return null
        }
    }

    const onDrop = useCallback(async (acceptedFiles: globalThis.File[]) => {
        setScanning(true)

        const newFiles: UploadedFile[] = acceptedFiles.map(file => {
            const type = determineFileType(file.name)
            return {
                id: Math.random().toString(36).substr(2, 9),
                file,
                type,
                status: 'uploading',
                progress: 0
            }
        })

        setUploadedFiles(prev => [...prev, ...newFiles])

        // Simulate upload progress
        newFiles.forEach((newFile, index) => {
            const interval = setInterval(() => {
                setUploadedFiles(prev => prev.map(f =>
                    f.id === newFile.id
                        ? { ...f, progress: Math.min(f.progress + 10, 90) }
                        : f
                ))
            }, 100)

            setTimeout(async () => {
                clearInterval(interval)

                // Simulate virus scan
                setUploadedFiles(prev => prev.map(f =>
                    f.id === newFile.id ? { ...f, status: 'scanning', progress: 95 } : f
                ))

                const scanResult = await simulateVirusScan()

                setUploadedFiles(prev => prev.map(f =>
                    f.id === newFile.id
                        ? {
                            ...f,
                            status: scanResult && scanResult.virus ? 'error' : 'success',
                            progress: 100,
                            scanResult
                        }
                        : f
                ))

                // Update store
                const fileData = new window.File([newFile.file], newFile.file.name, { type: newFile.file.type })
                const fieldName = getFieldName(newFile.type)
                if (fieldName) {
                    updateDocuments({ [fieldName]: fileData })
                }
            }, 1000 + index * 500)
        })

        setTimeout(() => setScanning(false), 3000)
    }, [updateDocuments])

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: true
    })

    // (determineFileType and getFieldName were moved above)

    const getTypeLabel = (type: UploadedFile['type']) => {
        switch (type) {
            case 'id_front': return 'ID Front'
            case 'id_back': return 'ID Back'
            case 'payslip': return 'Payslip'
            case 'residence': return 'Proof of Residence'
            case 'statement': return 'Bank Statement'
        }
    }

    const removeFile = (id: string) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== id))
    }

    const documentTypes = [
        { type: 'id_front' as const, label: 'National ID (Front)', required: true },
        { type: 'id_back' as const, label: 'National ID (Back)', required: true },
        { type: 'payslip' as const, label: 'Recent Payslip', required: true },
        { type: 'residence' as const, label: 'Proof of Residence', required: true },
        { type: 'statement' as const, label: 'Bank Statement', required: false },
    ]

    return (
        <div className="space-y-6">
            {/* Security Header */}
            <div className="flex items-center justify-between p-4 bg-equity-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-equity-blue-600" />
                    <div>
                        <h4 className="font-medium text-equity-blue-800">Secure Document Upload</h4>
                        <p className="text-sm text-equity-blue-600">
                            All documents are encrypted and scanned for security
                        </p>
                    </div>
                </div>
                {scanning && (
                    <div className="flex items-center gap-2 text-sm text-equity-blue-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Scanning documents...
                    </div>
                )}
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-equity-red-500 bg-equity-red-50' : 'border-gray-300 hover:border-equity-red-400 hover:bg-gray-50'}`}
            >
                <input {...getInputProps()} />
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-equity-red-500' : 'text-gray-400'}`} />
                <p className="text-gray-700 font-medium">
                    {isDragActive ? 'Drop files here' : 'Drag & drop documents or click to browse'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Supported: JPG, PNG, PDF (Max 5MB each)
                </p>
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); open() }}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-equity-red-500 to-equity-red-600 text-white rounded-md hover:from-equity-red-600 hover:to-equity-red-700 transition-colors"
                >
                    Browse Files
                </button>
            </div>

            {/* Document Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {documentTypes.map((doc) => {
                    const uploadedFile = uploadedFiles.find(f => f.type === doc.type)
                    const isUploaded = uploadedFile?.status === 'success'

                    return (
                        <div
                            key={doc.type}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-colors
                ${isUploaded
                                    ? 'border-green-500 bg-green-50'
                                    : doc.required
                                        ? 'border-gray-300 bg-white hover:border-equity-red-300'
                                        : 'border-gray-200 bg-gray-50'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3
                ${isUploaded ? 'bg-green-100' : 'bg-gray-100'}`}
                            >
                                <FileIcon className={`w-6 h-6 ${isUploaded ? 'text-green-600' : 'text-gray-400'}`} />
                            </div>
                            <p className="font-medium text-sm text-gray-800">{doc.label}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {doc.required ? 'Required' : 'Optional'}
                            </p>
                            {isUploaded && (
                                <div className="mt-2 flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-xs">Uploaded</span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Uploaded Documents</h4>
                    <div className="space-y-3">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <FileIcon className="w-8 h-8 text-gray-400" />
                                        {file.status === 'success' && (
                                            <div className="absolute -top-1 -right-1">
                                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-medium text-sm text-gray-800">
                                            {file.file.name}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {getTypeLabel(file.type)} • {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                            {file.scanResult && !file.scanResult.virus && (
                                                <span className="text-xs text-green-600">
                                                    OCR Confidence: {file.scanResult.ocrConfidence.toFixed(1)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Progress Bar */}
                                    {file.status !== 'success' && file.status !== 'error' && (
                                        <div className="w-24">
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-equity-red-600 transition-all duration-300"
                                                    style={{ width: `${file.progress}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 text-center mt-1">
                                                {file.status === 'scanning' ? 'Scanning...' : 'Uploading...'}
                                            </p>
                                        </div>
                                    )}

                                    {/* Status Icons */}
                                    {file.status === 'success' && file.scanResult && (
                                        <div className="flex items-center gap-2">
                                            {file.scanResult.virus ? (
                                                <div className="flex items-center gap-1 text-red-600">
                                                    <XCircle className="w-4 h-4" />
                                                    <span className="text-xs">Virus Detected</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <Shield className="w-4 h-4" />
                                                    <span className="text-xs">Secure</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => window.open(URL.createObjectURL(file.file), '_blank')}
                                            className="p-2 text-gray-500 hover:text-equity-red-600 transition-colors"
                                            title="Preview"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Scan Results Summary */}
            {uploadedFiles.some(f => f.scanResult) && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Security Scan Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl font-bold text-green-600">
                                {uploadedFiles.filter(f => f.scanResult && !f.scanResult.virus).length}
                            </p>
                            <p className="text-sm text-gray-600">Safe Documents</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl font-bold text-red-600">
                                {uploadedFiles.filter(f => f.scanResult && f.scanResult.virus).length}
                            </p>
                            <p className="text-sm text-gray-600">Threats Blocked</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">
                                {uploadedFiles.filter(f => f.scanResult).length}
                            </p>
                            <p className="text-sm text-gray-600">Total Scanned</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}