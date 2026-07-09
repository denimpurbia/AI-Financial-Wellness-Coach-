import { useState, useRef, useEffect } from 'react';
import { X, Loader2, Camera } from 'lucide-react';
import jsQR from 'jsqr';

interface QRScannerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onQRScanned: (qrData: string) => void;
  isLoading?: boolean;
}

export function QRScannerForm({ isOpen, onClose, onQRScanned, isLoading = false }: QRScannerFormProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');
  const [scannedData, setScannedData] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const isScanningRef = useRef(false);
  const scanIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError('');
      setScannedData('');
      setCameraActive(false);
      
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        
        // Play the video
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Video is playing
              setCameraActive(true);
              startScanning();
            })
            .catch((error) => {
              console.error('Video play error:', error);
              // Try fallback
              setTimeout(() => {
                if (videoRef.current && videoRef.current.videoWidth > 0) {
                  setCameraActive(true);
                  startScanning();
                }
              }, 500);
            });
        } else {
          // Older browsers
          setTimeout(() => {
            if (videoRef.current && videoRef.current.videoWidth > 0) {
              setCameraActive(true);
              startScanning();
            }
          }, 500);
        }

        // Additional fallback - force active after 2 seconds
        setTimeout(() => {
          if (videoRef.current && videoRef.current.videoWidth > 0) {
            console.log('Forcing camera active (fallback)');
            setCameraActive(true);
            if (!isScanningRef.current) {
              startScanning();
            }
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    isScanningRef.current = false;
    
    if (scanIntervalRef.current) {
      cancelAnimationFrame(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  };

  const startScanning = () => {
    if (isScanningRef.current) return;
    isScanningRef.current = true;
    scanQRCode();
  };

  const scanQRCode = () => {
    if (!isScanningRef.current || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      scanIntervalRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      });

      if (code && code.data) {
        // We found a QR code!
        isScanningRef.current = false;
        const qrContent = code.data;
        
        // Extract user name from QR data
        const userName = extractUserName(qrContent);
        
        setScannedData(userName);
        setShowConfirmation(true);
        stopCamera();
        return;
      }
    } catch (err) {
      console.error('QR scanning error:', err);
    }

    // Continue scanning
    if (isScanningRef.current) {
      scanIntervalRef.current = requestAnimationFrame(scanQRCode);
    }
  };

  const extractUserName = (qrData: string): string => {
    // Try various formats to extract user name
    
    // If it's a URL with user info
    if (qrData.includes('user=')) {
      const match = qrData.match(/user=([^&]+)/);
      if (match) return decodeURIComponent(match[1]);
    }
    
    // If it contains @, extract the user part
    if (qrData.includes('@')) {
      const parts = qrData.split('@')[0];
      return parts.replace(/_/g, ' ').trim();
    }
    
    // If it contains a name-like pattern
    if (qrData.match(/[a-zA-Z]+/)) {
      return qrData.split(/[0-9_-]/)[0] || qrData;
    }
    
    // Otherwise return the full data
    return qrData;
  };

  const handleConfirmPayment = () => {
    if (scannedData) {
      onQRScanned(scannedData);
      setScannedData('');
      setShowConfirmation(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  if (showConfirmation && scannedData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div
          className="w-full max-w-md rounded-2xl p-6 relative my-auto max-h-[90vh] overflow-y-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(0,6,20,0.95) 0%, rgba(10,4,30,0.95) 100%)',
            border: '1px solid rgba(0,217,255,0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,217,255,0.1)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <button
            onClick={() => {
              setShowConfirmation(false);
              setScannedData('');
              startCamera();
            }}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <h2 className="text-2xl font-bold text-white mb-6">QR Code Detected</h2>

          <div className="space-y-4">
            <div
              className="p-4 rounded-lg border"
              style={{
                background: 'rgba(0, 217, 255, 0.05)',
                borderColor: 'rgba(0, 217, 255, 0.3)'
              }}
            >
              <p className="text-sm text-white/60 mb-2">User:</p>
              <p className="text-xl font-bold text-[#00D9FF] break-all capitalize">{scannedData}</p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-300 text-sm">✓ QR code successfully scanned!</p>
            </div>

            <p className="text-white/60 text-sm">
              You can now enter the payment amount and complete the transaction to this user.
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowConfirmation(false);
                setScannedData('');
                startCamera();
              }}
              className="flex-1 py-2 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
            >
              Rescan
            </button>
            <button
              onClick={handleConfirmPayment}
              className="flex-1 py-3 bg-gradient-to-r from-[#00D9FF] to-[#7C83FD] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00D9FF]/50 transition-all"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div
        className="w-full max-w-md rounded-2xl p-6 relative my-auto max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(0,6,20,0.95) 0%, rgba(10,4,30,0.95) 100%)',
          border: '1px solid rgba(0,217,255,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,217,255,0.1)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">QR Code Scanner</h2>
        <p className="text-white/60 text-sm mb-6">Point your camera at a QR code</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={startCamera}
              className="mt-2 px-3 py-1 bg-red-500/30 hover:bg-red-500/50 text-red-200 text-xs rounded transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Camera View */}
        <div className="relative rounded-xl overflow-hidden mb-4 bg-black/50 border border-[#7C83FD]/30">
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full aspect-video object-cover"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {/* Scanner Frame Overlay */}
              <div 
                className="absolute inset-0 border-2 m-auto"
                style={{
                  width: '80%',
                  height: '80%',
                  borderColor: 'rgba(0, 217, 255, 0.6)',
                  borderRadius: '8px'
                }}
              />
              
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="inline-flex items-center gap-2 bg-black/60 px-3 py-2 rounded-full">
                  <Camera className="w-4 h-4 text-[#00D9FF]" />
                  <span className="text-xs text-white">Scanning...</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
              <div className="text-center">
                {error ? (
                  <Camera className="w-12 h-12 text-red-400 mx-auto mb-2 opacity-50" />
                ) : (
                  <Loader2 className="w-12 h-12 text-[#00D9FF] mx-auto mb-2 animate-spin" />
                )}
                <p className="text-white/60 text-sm">
                  {error ? 'Camera Error' : 'Initializing Camera...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
          <p className="text-blue-300 text-xs">
            💡 Allow camera access when prompted. Position the QR code within the frame for best results.
          </p>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
}
