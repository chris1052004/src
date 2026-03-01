import { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  Car,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Chip } from '../components/Chip';
import { Input, SearchInput } from '../components/Input';
import { ProgressBar } from '../components/ProgressBar';
import { MiniBarChart, MiniLineChart } from '../components/MiniChart';
import { IsometricCar, IsometricChecklistScene, IsometricRoadScene } from '../components/IsometricCar';
import { useTheme } from '../contexts/ThemeContext';

export default function DesignSystem() {
  const { theme, toggleTheme } = useTheme();
  const [chipActive, setChipActive] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-divider/50 px-4 status-bar-aware">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl">G Tech Auditor Design System</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8 pb-24">
        {/* Colors */}
        <section>
          <h2 className="text-xl mb-4">Color Tokens</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-base mb-3">Primary Blue</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-primary-blue" />
                  <p className="text-xs text-muted-foreground">Primary Blue</p>
                  <code className="text-xs">#2563EB</code>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-primary-blue-dark" />
                  <p className="text-xs text-muted-foreground">Dark</p>
                  <code className="text-xs">#1E40AF</code>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-primary-blue-light" />
                  <p className="text-xs text-muted-foreground">Light</p>
                  <code className="text-xs">#3B82F6</code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base mb-3">Semantic Colors</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-danger-red" />
                  <p className="text-xs text-muted-foreground">Danger Red</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-warning-amber" />
                  <p className="text-xs text-muted-foreground">Warning</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-success-green" />
                  <p className="text-xs text-muted-foreground">Success</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-info-blue" />
                  <p className="text-xs text-muted-foreground">Info</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base mb-3">Neutral Scale</h3>
              <div className="grid grid-cols-5 gap-2">
                {[50, 100, 200, 400, 600, 800, 900].map((shade) => (
                  <div key={shade} className="space-y-2">
                    <div
                      className={`h-16 rounded-lg bg-neutral-${shade} border border-divider`}
                    />
                    <p className="text-xs text-muted-foreground">{shade}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-xl mb-4">Typography</h2>
          <Card className="space-y-4">
            <div>
              <h1>Heading 1 - Main Title</h1>
              <code className="text-xs text-muted-foreground">2xl / Medium</code>
            </div>
            <div>
              <h2>Heading 2 - Section Title</h2>
              <code className="text-xs text-muted-foreground">xl / Medium</code>
            </div>
            <div>
              <h3>Heading 3 - Subsection</h3>
              <code className="text-xs text-muted-foreground">lg / Medium</code>
            </div>
            <div>
              <h4>Heading 4 - Card Title</h4>
              <code className="text-xs text-muted-foreground">base / Medium</code>
            </div>
            <div>
              <p className="text-base">Body text - Regular paragraph content for descriptions and detailed information.</p>
              <code className="text-xs text-muted-foreground">base / Normal</code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Small text - Secondary information and metadata</p>
              <code className="text-xs text-muted-foreground">sm / Normal</code>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Caption - Timestamps and helper text</p>
              <code className="text-xs text-muted-foreground">xs / Normal</code>
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-xl mb-4">Buttons</h2>
          <Card className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-base">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base">States</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button className="w-full">Full Width</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-xl mb-4">Badges</h2>
          <Card>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-base">Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base">Sizes</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base">Status Examples</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Draft</Badge>
                  <Badge variant="primary">In Progress</Badge>
                  <Badge variant="success">Completed</Badge>
                  <Badge variant="danger">Overdue</Badge>
                  <Badge variant="warning">Pending Review</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Chips / Filter Pills */}
        <section>
          <h2 className="text-xl mb-4">Chips (Filters)</h2>
          <Card>
            <div className="flex flex-wrap gap-2">
              <Chip label="All" active={true} onClick={() => {}} />
              <Chip label="Draft" active={false} onClick={() => {}} />
              <Chip label="In Progress" active={false} onClick={() => {}} />
              <Chip label="Submitted" active={false} onClick={() => {}} />
              <Chip label="Overdue" active={false} onClick={() => {}} />
            </div>
          </Card>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-xl mb-4">Inputs</h2>
          <Card className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Default Input</label>
              <Input placeholder="Enter text..." />
            </div>
            <div>
              <label className="block text-sm mb-2">Search Input</label>
              <SearchInput placeholder="Search..." />
            </div>
            <div>
              <label className="block text-sm mb-2">With Error</label>
              <Input placeholder="Invalid input" error="This field is required" />
            </div>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-xl mb-4">Cards</h2>
          <div className="space-y-3">
            <Card>
              <h3 className="text-base mb-2">Default Card</h3>
              <p className="text-sm text-muted-foreground">
                This is a standard card with padding and border
              </p>
            </Card>

            <Card className="border-l-4 border-l-primary bg-primary/5">
              <h3 className="text-base mb-2">Highlighted Card</h3>
              <p className="text-sm text-muted-foreground">
                Card with left accent border
              </p>
            </Card>

            <Card className="border-l-4 border-l-danger-red bg-danger-red/5">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-danger-red" />
                <div>
                  <h3 className="text-base">Alert Card</h3>
                  <p className="text-sm text-muted-foreground">Critical issue notification</p>
                </div>
              </div>
            </Card>

            <Card className="cursor-pointer card-interactive">
              <h3 className="text-base mb-2">Interactive Card</h3>
              <p className="text-sm text-muted-foreground">
                Clickable card with hover and active states
              </p>
            </Card>
          </div>
        </section>

        {/* Progress Bars */}
        <section>
          <h2 className="text-xl mb-4">Progress Bars</h2>
          <Card className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Default Progress</span>
                <span className="text-muted-foreground">60%</span>
              </div>
              <ProgressBar value={60} />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Success State</span>
                <span className="text-muted-foreground">100%</span>
              </div>
              <ProgressBar value={100} variant="success" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Warning State</span>
                <span className="text-muted-foreground">30%</span>
              </div>
              <ProgressBar value={30} variant="warning" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Danger State</span>
                <span className="text-muted-foreground">15%</span>
              </div>
              <ProgressBar value={15} variant="danger" />
            </div>
          </Card>
        </section>

        {/* Charts */}
        <section>
          <h2 className="text-xl mb-4">Mini Charts</h2>
          <div className="space-y-3">
            <Card>
              <h3 className="text-base mb-4">Bar Chart</h3>
              <MiniBarChart
                data={[12, 18, 15, 22, 19, 25, 21]}
                labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                color="#3B82F6"
              />
            </Card>

            <Card>
              <h3 className="text-base mb-4">Line Chart</h3>
              <MiniLineChart
                data={[10, 15, 12, 20, 18, 25, 22]}
                color="#10B981"
              />
            </Card>
          </div>
        </section>

        {/* Isometric Illustrations */}
        <section>
          <h2 className="text-xl mb-4">Isometric Illustrations</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="text-sm mb-3">Road Scene</h3>
              <IsometricRoadScene className="w-full h-32 text-primary" />
            </Card>

            <Card className="bg-gradient-to-br from-success-green/5 to-success-green/10">
              <h3 className="text-sm mb-3">Checklist</h3>
              <IsometricChecklistScene className="w-full h-32 text-success-green" />
            </Card>

            <Card className="col-span-2 bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="text-sm mb-3">Car Illustration</h3>
              <div className="flex justify-center">
                <IsometricCar className="w-48 h-32 text-primary" />
              </div>
            </Card>
          </div>
        </section>

        {/* Icons & Symbols */}
        <section>
          <h2 className="text-xl mb-4">Icons</h2>
          <Card>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-success-green/10 text-success-green flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs">Success</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-danger-red/10 text-danger-red flex items-center justify-center mx-auto">
                  <XCircle className="w-6 h-6" />
                </div>
                <p className="text-xs">Error</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-warning-amber/10 text-warning-amber flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <p className="text-xs">Warning</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-info-blue/10 text-info-blue flex items-center justify-center mx-auto">
                  <Info className="w-6 h-6" />
                </div>
                <p className="text-xs">Info</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Spacing System */}
        <section>
          <h2 className="text-xl mb-4">Spacing System (8pt Grid)</h2>
          <Card className="space-y-4">
            <div className="space-y-2">
              <code className="text-xs">p-2 = 8px</code>
              <div className="p-2 bg-primary/10 rounded">
                <div className="bg-primary rounded h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <code className="text-xs">p-4 = 16px</code>
              <div className="p-4 bg-primary/10 rounded">
                <div className="bg-primary rounded h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <code className="text-xs">p-6 = 24px</code>
              <div className="p-6 bg-primary/10 rounded">
                <div className="bg-primary rounded h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <code className="text-xs">p-8 = 32px</code>
              <div className="p-8 bg-primary/10 rounded">
                <div className="bg-primary rounded h-4" />
              </div>
            </div>
          </Card>
        </section>

        {/* Border Radius */}
        <section>
          <h2 className="text-xl mb-4">Border Radius</h2>
          <Card>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-primary rounded-lg mx-auto" />
                <p className="text-xs">rounded-lg</p>
                <code className="text-xs">12px</code>
              </div>
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-primary rounded-xl mx-auto" />
                <p className="text-xs">rounded-xl</p>
                <code className="text-xs">16px</code>
              </div>
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto" />
                <p className="text-xs">rounded-full</p>
                <code className="text-xs">9999px</code>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
