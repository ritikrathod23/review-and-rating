import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Badge } from "@repo/ui";

export default function ThemeShowcase() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Design System Tokens</h1>
        <p className="text-muted-foreground">Showcasing the scalable Tailwind CSS theme implementation.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default Badge</Badge>
          <Badge variant="secondary">Secondary Badge</Badge>
          <Badge variant="destructive">Destructive Badge</Badge>
          <Badge variant="outline">Outline Badge</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Input Field</h2>
        <div className="max-w-sm">
          <Input type="email" placeholder="Email Address..." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input placeholder="Name of your project" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription className="text-primary-foreground/80">Unlock all premium features today.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Includes unlimited reviews, advanced analytics, and custom branding.</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">Upgrade Now</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Dark mode manual toggle test (Assuming you inject 'dark' class on HTML or body) */}
      <section className="space-y-4 pt-8">
        <div className="p-4 bg-muted rounded-lg border">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> To test dark mode, add the <code>dark</code> class to the <code>&lt;html&gt;</code> or <code>&lt;body&gt;</code> element in the browser inspector, or setup a theme provider component (like <code>next-themes</code>).
          </p>
        </div>
      </section>
    </div>
  );
}
