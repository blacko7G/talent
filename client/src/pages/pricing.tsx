import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/lib/authContext";

const PricingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: billingCycle === "monthly" ? 0 : 0,
      features: [
        "Basic profile",
        "Limited video uploads (3)",
        "Basic search functionality",
        "Community access",
        "Email support"
      ],
      cta: isAuthenticated ? "Current Plan" : "Get Started",
      href: isAuthenticated ? "/dashboard" : "/register",
      popular: false
    },
    {
      name: "Pro",
      description: "For serious players and scouts",
      price: billingCycle === "monthly" ? 19.99 : 199.99,
      features: [
        "Everything in Free",
        "Unlimited video uploads",
        "Advanced search filters",
        "Priority support",
        "Analytics dashboard",
        "Direct messaging",
        "Trial application tracking"
      ],
      cta: "Upgrade Now",
      href: isAuthenticated ? "/dashboard" : "/register",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For academies and professional teams",
      price: billingCycle === "monthly" ? 49.99 : 499.99,
      features: [
        "Everything in Pro",
        "Team management",
        "Custom branding",
        "API access",
        "Dedicated account manager",
        "Advanced analytics",
        "Custom integrations"
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false
    }
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that's right for you. All plans include a 14-day free trial.
        </p>
        
        <div className="flex justify-center items-center mt-8 space-x-4">
          <span className={`text-sm ${billingCycle === "monthly" ? "font-bold" : ""}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm ${billingCycle === "yearly" ? "font-bold" : ""}`}>
            Yearly <span className="text-green-500 font-medium">(Save 20%)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}
          >
            {plan.popular && (
              <div className="bg-primary text-white text-center py-1 rounded-t-lg">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/{billingCycle === "monthly" ? "month" : "year"}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto grid gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Can I change my plan later?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Is there a contract or commitment?</h3>
            <p>No, all plans are billed on a monthly or yearly basis and you can cancel at any time.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
            <p>Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 