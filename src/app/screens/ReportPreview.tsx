import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Download, Share2, FileText, Globe, FileImage } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

const tabs = ['Report', 'Web Preview', 'PDF Preview'];

export default function ReportPreview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Report');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-divider px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/app/inspections')}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl">Inspection Report</h1>
            <p className="text-sm text-muted-foreground">Pre-Delivery Vehicle Check</p>
          </div>
          <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary-blue text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 space-y-4 pb-32">
        {/* Report Cover */}
        <Card>
          <div className="text-center py-8 border-b border-divider mb-4">
            <div className="bg-primary-blue/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-blue" />
            </div>
            <h2 className="text-xl mb-2">Pre-Delivery Vehicle Check</h2>
            <p className="text-sm text-muted-foreground">Downtown Service Center</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Badge variant="success">Submitted</Badge>
              <Badge variant="default">Score: 85%</Badge>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Report ID:</span>
              <span>#INS-2026-0124</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prepared by:</span>
              <span>John Smith</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>Feb 24, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span>123 Main Street</span>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Card>
          <h3 className="text-base mb-3">Summary</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl mb-1">21</p>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </div>
            <div>
              <p className="text-2xl text-success-green mb-1">18</p>
              <p className="text-xs text-muted-foreground">Passed</p>
            </div>
            <div>
              <p className="text-2xl text-danger-red mb-1">3</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>
        </Card>

        {/* Findings */}
        <div>
          <h3 className="text-base mb-3">Findings</h3>
          <div className="space-y-3">
            <Card>
              <div className="flex items-start gap-3">
                <Badge variant="danger" size="sm">
                  High
                </Badge>
                <div className="flex-1">
                  <h4 className="text-sm mb-1">Windshield Damage</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Small crack on passenger side
                  </p>
                  <div className="flex gap-2">
                    <img
                      src="https://via.placeholder.com/60"
                      alt="Evidence"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <Badge variant="warning" size="sm">
                  Medium
                </Badge>
                <div className="flex-1">
                  <h4 className="text-sm mb-1">Interior Light Issue</h4>
                  <p className="text-xs text-muted-foreground">
                    Glove box light not functioning
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <Badge variant="info" size="sm">
                  Low
                </Badge>
                <div className="flex-1">
                  <h4 className="text-sm mb-1">Spare Tire Pressure</h4>
                  <p className="text-xs text-muted-foreground">
                    Tire pressure below recommended level
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Actions Required */}
        <Card>
          <h3 className="text-base mb-3">Actions Required</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-divider last:border-0">
              <span>Replace windshield</span>
              <Badge variant="danger" size="sm">
                Urgent
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-divider last:border-0">
              <span>Fix interior light</span>
              <Badge variant="warning" size="sm">
                Soon
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-20 left-0 right-0 bg-card border-t border-divider p-4">
        <div className="max-w-md mx-auto flex gap-3">
          <Button variant="secondary" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
          <Button fullWidth size="lg">
            <Share2 className="w-5 h-5 mr-2" />
            Share Report
          </Button>
        </div>
      </div>
    </div>
  );
}
