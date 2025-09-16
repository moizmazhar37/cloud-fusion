'use client';
import { useRouter } from "next/navigation";



export default function Home() {

  const router = useRouter()

  return (
    <>

      <div className="bg-Bg h-screen">
        <div className="bg-current p-3">
          <div className="text-md text-center text-black">Cloud Fusion now supports Infrastructure Management and Monitoring 🚀</div>
        </div>

        <header className="text-gray-600 body-font">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
              <img src="/Logo.png" className="w-12 h-12 cursor-pointer" />
              <span className="ml-3 text-xl font-bold text-white  cursor-pointer
            ">CLOUD FUSION</span>
            </a>
            <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
              <a className="mr-8 text-white cursor-pointer hover:text-current">Home</a>
              <a className="mr-8 text-white cursor-pointer hover:text-current">About</a>
              <a className="mr-8 text-white cursor-pointer hover:text-current">Services</a>
              <a className="mr-8 text-white cursor-pointer hover:text-current">Company</a>
            </nav>
            <div className="flex flex-wrap items-center justify-center">
              <button className="border-2 border-temp hover:bg-gray-200 text-white hover:text-black py-2 px-4 rounded-full"
                onClick={() => router.push('/auth/login')}
              >
                Login
              </button>
              <button className="bg-current hover:bg-gray-200 text-black hover:text-black py-2 px-4 rounded-full ml-4"
                onClick={() => router.push('/auth/register')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </header>

        <section className="relative mt-8">
          <div className="absolute inset-0 m-auto max-w-xs h-[200px] blur-[500px] sm:max-w-md md:max-w-lg" style={{ background: "#00e599" }}></div>
          <div className="relative max-w-screen-xl mx-auto px-4 py-28 md:px-8">
            <div className="space-y-14 max-w-5xl mx-auto text-center">
              <h2 className="text-5xl text-white font-extrabold mx-auto md:text-5xl border border-current border-dashed max-w-max p-4">
                "Empower Your App: One-Touch Deployment to Any Cloud, Effortlessly"
              </h2>
              <p className="max-w-6xl mx-auto text-white border border-white border-dashed p-4">
                Chosen by Leading Organizations for Efficient Deployment: A Single Click Transforms Your App to Any Cloud with Seamless DevOps Integration, Automated CI/CD, and Cloud Provisioning—Simplifying Developers' Lives.              </p>
              <form className="justify-center items-center sm:flex">
                <div className='border border-current border-dashed p-7 w-full'></div>
                <div className='flex flex-row justify-center gap-3 border border-current border-dashed p-2 w-full'>
                  <button className="flex items-center justify-center gap-x-2 py-2 px-4 mt-3 w-full text-sm text-white hover:bg-current active:bg-sky-600 duration-150 rounded-lg sm:mt-0 sm:w-auto border border-white">
                    Learn More
                  </button>
                  <button className="flex items-center justify-center gap-x-2 py-2 px-4 mt-3 w-full text-sm text-black  bg-current hover:bg-temp active:bg-sky-600 duration-150 rounded-lg sm:mt-0 sm:w-auto">
                    Get started
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className='border border-current border-dashed p-7 w-full'></div>
              </form>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-Bg ">
        <section className="text-gray-600 body-font">
          <div className="container px-1 py-24 mx-auto flex flex-wrap md:px-4 md:py-4">
            <div className="max-w-xl mx-auto text-center ">
              <h3 className="text-white text-3xl font-semibold sm:text-4xl">
                <span>
                  Workflows of Cloud Fusion</span>
                <span className='block text-xl 
                text-white mt-3
                '>
                  Built on a foundation of fast, production-grade tooling
                </span>
              </h3>
              <p className="text-white mt-3">
                Cloud Fusion is a complete suite of tools for building a modern web app, from prototyping to deployment.
              </p>
            </div>
            <div className="flex relative pt-10 pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-current text-black relative z-10 title-font font-medium text-sm">1</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-temp text-rose-500 rounded-full inline-flex items-center justify-center">
                  <img width="80" height="80" src="/Githubicon.png" alt="github-2" />
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-white mb-1 text-xl">
                    Login with GitHub
                  </h2>
                  <p className="leading-relaxed text-gray-200">Get authorized via  GITHUB  and select your application to be deployed</p>
                </div>
              </div>
            </div>
            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-current text-black relative z-10 title-font font-medium text-sm">2</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-temp text-rose-500 rounded-full inline-flex items-center justify-center">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-12 h-12" viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-white mb-1 text-xl">Select your Cloud</h2>
                  <p className="leading-relaxed text-gray-200">
                    Select your cloud provider and the region you want to deploy your app to. We offer deployments to AWS , AZURE , Digital Ocean and Private Cloud.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-current text-black  relative z-10 title-font font-medium text-sm">3</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-temp text-rose-500 rounded-full inline-flex items-center justify-center">
                  <img width="60" height="60" src="https://img.icons8.com/color/144/000000/terraform.png" alt="terraform" />
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-white mb-1 text-xl">Generation and Excution of Terraform scripts</h2>
                  <p className="leading-relaxed text-gray-200">
                    Automated infrastructure setup with generated Terraform scripts via our platform
                  </p>
                </div>
              </div>
            </div>
            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-current text-black relative z-10 title-font font-medium text-sm">4</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-temp text-rose-500 rounded-full inline-flex items-center justify-center">
                  <img width="50" height="50" src="https://img.icons8.com/ios/50/thin-client.png" alt="thin-client" />
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-white mb-1 text-xl">Automated Network Configurations</h2>
                  <p className="leading-relaxed text-gray-200">
                    Automated network configurations of inbounds and outbounds of Virtual Machines
                  </p>
                </div>
              </div>
            </div>
            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-current text-black relative z-10 title-font font-medium text-sm">5</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-temp text-rose-500 rounded-full inline-flex items-center justify-center">
                  <img width="80" height="80" src="https://img.icons8.com/color/144/000000/ansible.png" alt="ansible" />
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-white mb-1 text-xl">Generation and Excution of Ansible Playbooks</h2>
                  <p className="leading-relaxed text-gray-200">
                    Automated Virtual Machines setup with generated Ansible playbook via our platform.</p>
                </div>
              </div>
            </div>
            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-current text-black relative z-10 title-font font-medium text-sm">6</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-temp text-rose-500 rounded-full inline-flex items-center justify-center">
                  <img width="60" height="60" src="https://img.icons8.com/ios-glyphs/90/ssh.png" alt="ssh" />
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-white mb-1 text-xl">SSH Key Generation for Virtual Machines</h2>
                  <p className="leading-relaxed text-gray-200">
                    Automated SSH key generation for Virtual Machines</p>
                </div>
              </div>
            </div>

            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-current text-black relative z-10 title-font font-medium text-sm">7</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-temp text-rose-500 rounded-full inline-flex items-center justify-center">
                  <img width="60" height="60" src="https://img.icons8.com/color/144/000000/docker.png" alt="docker" />
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-white mb-1 text-xl">Application Deployment using Virtual Machines</h2>
                  <p className="leading-relaxed text-gray-200">
                    Automated application deployment using Virtual Machines
                  </p>
                </div>
              </div>
            </div>

            <div className="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-current text-black relative z-10 title-font font-medium text-sm">8</div>
              <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-temp text-rose-500 rounded-full inline-flex items-center justify-center">
                  <img width="80" height="80" src="https://img.icons8.com/color/144/000000/git.png" alt="git" />
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-white mb-1 text-xl">Automated CICD Injection via GitHub Actions & Testing</h2>
                  <p className="leading-relaxed text-gray-200">
                    Automated CICD Injection via GitHub Actions & Testing
                  </p>
                </div>
              </div>
            </div>


          </div>
        </section>
    
        <div className="py-14 ">
          <div className="max-w-screen-xl mx-auto px-4 py-4 rounded border border-current md:px-8 md:py-8 bg-black">
            <div className="max-w-xl mx-auto text-center">
              <h3 className="text-current text-3xl font-semibold sm:text-4xl">
                <span>What's in Cloud Fusion?</span>
                <span className='block text-xl 
                text-white mt-3
                '>All the tools we use to make the deployments faster.</span>
              </h3>
              <p className="text-white mt-3">
                Cloud Fusion is a complete suite of tools for building a modern web app, from prototyping to deployment.
              </p>
            </div>
            <div className="mt-12 flex justify-center">
              <ul className="inline-grid grid-cols-2 gap-x-10 gap-y-6 md:gap-x-16 md:grid-cols-3 lg:grid-cols-6">
                {/* AWS Logo */}
                <li>
                  <img width="80" height="80" src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/96/external-amazon-web-services-a-subsidiary-of-amazon-that-provides-on-demand-cloud-computing-logo-color-tal-revivo.png" alt="external-amazon-web-services-a-subsidiary-of-amazon-that-provides-on-demand-cloud-computing-logo-color-tal-revivo" />
                </li>

                {/*Azure Logo*/}
                <li>
                  <img width="80" height="80" src="https://img.icons8.com/color/144/azure-1.png" alt="azure-1" />
                </li>

                {/* LOGO 3 */}
                <li>
                  <img width="80" height="80" src="https://img.icons8.com/color/144/000000/ansible.png" alt="ansible" />
                </li>

                {/* digital ocean */}
                <li>
                  <img width="80" height="80" src="https://img.icons8.com/color/144/000000/terraform.png" alt="terraform" />
                </li>

                {/* LOGO 5 */}
                <li>
                  <img width="80" height="80" src="https://img.icons8.com/color/144/000000/docker.png" alt="docker" />
                </li>

                {/* LOGO 6 */}
                <li>
                  <img width="80" height="80" src="https://img.icons8.com/color/144/000000/git.png" alt="git" />
                </li>

                {/* OpenStack*/}
                <li>
                  <img width="80" height="80" src="https://img.icons8.com/color/144/000000/openstack.png" alt="openstack" />
                </li>

                {/* Github Actions*/}
                <li>
                  <img width="80" height="80" src="/Github.png" alt="github-2" />
                </li>

                {/* Digital Ocean*/}
                <li>
                  <img width="80" height="80" src="/Githubicon.png" alt="github-2" />
                </li>

                {/* Node.js */}
                <li>
                  <img width="80" height="80" src="https://img.icons8.com/color/144/000000/nodejs.png" alt="nodejs" />
                </li>

                {/* Next.js */}
                <li>
                  <img width="80" height="80" src="https://img.icons8.com/color/144/000000/nextjs.png" alt="nextjs" />
                </li>

                {/* Prisma */}
                <li>
                  <img width="80" height="80" src="https://img.icons8.com/color/144/prisma-orm.png" alt="prisma-orm" />
                </li>

              </ul>
            </div>
          </div>
        </div>


        <footer className="text-gray-600 body-font bg-black border-t-2 border-current">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-100">
            <img width="50" height="50" src="/Logo.png" alt="CloudFusionLogo" />
            <span className="ml-3 text-xl">Cloud Fusion</span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2023 Cloud Fusion —
            <a href="https://twitter.com/knyttneve" className="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">
              @CloudFusion
            </a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a className="text-gray-500">
              <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500">
              <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500">
              <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                <circle cx="4" cy="4" r="2" stroke="none"></circle>
              </svg>
            </a>
          </span>
        </div>
      </footer>

      </div>

    </>
  )
}
